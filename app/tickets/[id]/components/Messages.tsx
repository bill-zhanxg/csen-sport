'use client';

import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { dayjs } from '@/libs/dayjs';
import { SerializedTicketMessage } from '@/libs/serializeData';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import { TicketEventType } from '../../types';

export function Messages({
	user,
	ticketId,
	getMessages,
}: {
	user: User;
	ticketId: string;
	getMessages: () => Promise<SerializedTicketMessage[]>;
}) {
	const [messages, setMessages] = useState<SerializedTicketMessage[] | null>(null);

	useEffect(() => {
		getMessages().then(setMessages);
	}, [getMessages]);

	useEffect(() => {
		const eventSource = new EventSource(`/tickets/${ticketId}/message-stream`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as TicketEventType;
			console.log(data);
			setMessages((prev) => [...(prev ?? []), data.message]);
		};

		return () => {
			eventSource.close();
		};
	}, [ticketId]);

	if (Array.isArray(messages) && messages.length < 1)
		return (
			<div className="flex flex-col items-center justify-center text-center h-full">
				<h2 className="text-3xl font-bold">Looks a bit empty here</h2>
				<p className="text-xl">Send a message to get started</p>
			</div>
		);

	return messages === null ? (
		<div className='flex items-center justify-center h-full'>
            <span className="loading loading-bars loading-lg"></span>
        </div>
	) : (
		messages.map((message) => (
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
					<div className="chat-footer opacity-50">Delivered</div>
				</div>
			</div>
		))
	);
}
