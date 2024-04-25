'use client';

import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { dayjs } from '@/libs/dayjs';
import { SerializedTicketMessage } from '@/libs/serializeData';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { TicketEventType } from '../../types';
import { OptimisticMessages } from './MessagesTab';

export function Messages({
	user,
	ticketId,
	getMessages,
	optimisticMessages,
}: {
	user: User;
	ticketId: string;
	getMessages: () => Promise<SerializedTicketMessage[]>;
	optimisticMessages: OptimisticMessages;
}) {
	const [messages, setMessages] = useState<SerializedTicketMessage[] | null | 'error'>(null);

	useEffect(() => {
		getMessages()
			.then(setMessages)
			.catch(() => setMessages('error'));
	}, [getMessages]);

	useEffect(() => {
		const eventSource = new EventSource(`/tickets/${ticketId}/message-stream`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as TicketEventType;
			console.log(data);
			setMessages((prev) => {
				if (prev === 'error') return prev;
				return [...(prev ?? []), data.message];
			});
		};

		return () => {
			eventSource.close();
		};
	}, [ticketId]);

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
			<span className="loading loading-bars loading-lg"></span>
		</div>
	) : (
		<>
			{messages.map((message) => (
				<div key={message.id} className="w-full min-h-24">
					<div className={`chat ${message.sender?.id === user.id ? 'chat-end' : 'chat-start'}`}>
						<div className="chat-image avatar">
							<div className="w-10 rounded-full">
								<UserAvatar user={message.sender ?? {}} className="rounded-full" />
							</div>
						</div>
						<div className="chat-header">
							{message.sender?.name ?? 'Unknown'}
							<div
								className="tooltip"
								data-tip={dayjs.tz(message.xata.createdAt, user.timezone ?? undefined).format('llll')}
							>
								<time className="text-xs opacity-50 ml-2">
									{dayjs.tz(message.xata.createdAt, user.timezone ?? undefined).format('LT')}
								</time>
							</div>
						</div>
						<div className="chat-bubble break-words">{message.message}</div>
						<div className="chat-footer opacity-50">{message.seen ? 'Seen' : 'Delivered'}</div>
					</div>
				</div>
			))}
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
