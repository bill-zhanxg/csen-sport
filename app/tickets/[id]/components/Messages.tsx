'use client';

import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { dayjs } from '@/libs/dayjs';
import { SerializedTicketMessage } from '@/libs/serializeData';
import { User } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { TicketMessageEventType } from '../../types';
import { markMessageAsSeen } from '../actions';
import { OptimisticMessages } from './MessagesTab';

export function Messages({
	user,
	ticketId,
	getMessages,
	getNextPage,
	optimisticMessages,
}: {
	user: User;
	ticketId: string;
	getMessages: () => Promise<SerializedTicketMessage[]>;
	getNextPage: (messageCount: number) => Promise<SerializedTicketMessage[]>;
	optimisticMessages: OptimisticMessages;
}) {
	const [messages, setMessages] = useState<SerializedTicketMessage[] | null | 'error'>(null);
	const [loadingMessages, setLoadingMessages] = useState<boolean | null | 'error'>(true);
	const [isTop, setIsTop] = useState(false);
	const [isBottom, setIsBottom] = useState(true);
	const chat = useRef<HTMLElement | null>(null);

	const scrollToBottom = useCallback(() => {
		const c = chat.current;
		if (c) {
			c.scrollTo(0, c.scrollHeight);
		}
	}, []);
	const scrollIfBottom = useCallback(() => {
		if (isBottom) scrollToBottom();
	}, [isBottom, scrollToBottom]);

	useEffect(() => {
		const c = document.getElementById('chat');
		// Set ref after load
		chat.current = c;
		getMessages()
			.then((messages) => {
				setMessages(messages.toReversed());
				scrollToBottom();
				// Prevent message not loading if the the screen is very tall
				if (c) setIsTop(c.scrollTop < 30);
				setLoadingMessages(false);
			})
			.catch(() => setMessages('error'));

		if (c) {
			c.onscroll = () => {
				setIsTop(c.scrollTop < 30);
				setIsBottom(c.scrollHeight - c.clientHeight <= c.scrollTop + 1);
			};

			return () => {
				c.onscroll = null;
			};
		}
	}, [getMessages, scrollToBottom]);

	useEffect(() => {
		const eventSource = new EventSource(`/tickets/${ticketId}/message-stream`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as TicketMessageEventType;
			if (data.type === 'new') {
				setMessages((prev) => {
					if (!prev || prev === 'error' || prev.map((message) => message.id).includes(data.message.id)) return prev;
					return [...prev, data.message];
				});
				if (data.message.sender?.id !== user.id) markMessageAsSeen(data.message.id);
			} else if (data.type === 'update') {
				setMessages((prev) => {
					if (!prev || prev === 'error') return prev;
					const index = prev.findIndex((message) => message.id === data.message.id);
					if (index === -1) return prev;
					prev[index] = data.message;
					return [...prev];
				});
			}
		};

		return () => {
			eventSource.close();
		};
	}, [ticketId, user]);

	useEffect(() => {
		scrollToBottom();
	}, [optimisticMessages, scrollToBottom]);
	useEffect(() => {
		scrollIfBottom();
	}, [messages, scrollIfBottom]);

	useEffect(() => {
		if (isTop) {
			const c = chat.current;
			if (loadingMessages !== false || !messages) return;
			setIsTop(false);
			setLoadingMessages(true);
			getNextPage(messages.length)
				.then((newMessages) => {
					if (newMessages.length < 1) return setLoadingMessages(null);
					// Scroll down 1 px if user is at the top to prevent infinite loading
					if (c?.scrollTop === 0) c.scrollTo(0, 1);
					setMessages((prev) => {
						if (prev === 'error') return prev;
						newMessages = newMessages.filter((message) => !prev?.map((m) => m.id).includes(message.id));
						return [...newMessages.toReversed(), ...(prev ?? [])];
					});
					setLoadingMessages(false);
				})
				.catch(() => setLoadingMessages('error'));
		}
	}, [isTop, messages, loadingMessages, getNextPage]);

	if (messages === 'error')
		return (
			<div className="flex flex-col items-center justify-center text-center h-full">
				<FaTriangleExclamation size={60} />
				<h2 className="text-3xl font-bold">Failed to load messages</h2>
			</div>
		);
	if (Array.isArray(messages) && messages.length < 1)
		return (
			<div className="flex flex-col items-center justify-center text-center h-full">
				<h2 className="text-3xl font-bold">Looks a bit empty here</h2>
				<p className="text-xl">Send a message to get started</p>
			</div>
		);

	return messages === null ? (
		<div className="flex items-center justify-center h-full">
			<span className="loading loading-dots loading-lg"></span>
		</div>
	) : (
		<>
			{loadingMessages === null ? (
				<div className="flex items-center justify-center h-10">You&apos;re at the top of the page</div>
			) : loadingMessages === 'error' ? (
				<div className="flex items-center justify-center h-10">There is an error loading messages</div>
			) : (
				loadingMessages && (
					<div className="flex items-center justify-center h-10">
						<span className="loading loading-bars loading-md"></span>
					</div>
				)
			)}
			{messages.map((message) => {
				const datetime = dayjs.tz(new Date(message.xata.createdAt), user.timezone ?? undefined);
				return (
					<div key={message.id} className="w-full min-h-24">
						<div className={`chat ${message.sender?.id === user.id ? 'chat-end' : 'chat-start'}`}>
							<div className="chat-image avatar">
								<div className="w-10 rounded-full">
									<UserAvatar user={message.sender ?? {}} className="rounded-full" />
								</div>
							</div>
							<div className="chat-header">
								{message.sender?.name ?? 'Unknown'}
								<div className="tooltip" data-tip={datetime.format('llll')}>
									<time className="text-xs opacity-50 ml-2">{datetime.format('LT')}</time>
								</div>
							</div>
							<div className="chat-bubble break-words">{message.message}</div>
							<div className="chat-footer opacity-50">{message.seen ? 'Seen' : 'Delivered'}</div>
						</div>
					</div>
				);
			})}
			{optimisticMessages.map((message) => (
				<div key={message.id} className="w-full min-h-24">
					<div className={`chat chat-end`}>
						<div className="chat-image avatar">
							<div className="w-10 rounded-full">
								<UserAvatar user={user} className="rounded-full" />
							</div>
						</div>
						<div className="chat-header">
							{user.name ?? 'Unknown'}
							<div className="tooltip" data-tip={dayjs.tz(new Date(), user.timezone ?? undefined).format('llll')}>
								<time className="text-xs opacity-50 ml-2">
									{dayjs.tz(new Date(), user.timezone ?? undefined).format('LT')}
								</time>
							</div>
						</div>
						<div className="chat-bubble break-words">{message.message}</div>
						<div className="chat-footer opacity-50">Sending</div>
					</div>
				</div>
			))}
		</>
	);
}
