'use client';

import type { SerializedTicketMessage } from '@/libs/serializeData';
import type { User } from 'next-auth';
import { useState } from 'react';

import { MessageInput } from './MessageInput';
import { Messages } from './Messages';

export type OptimisticMessages = {
	id: string;
	message: string;
}[];

export function MessageTab({
	user,
	ticketId,
	getMessagesAction: getMessages,
	getNextPageAction: getNextPage,
	sendMessageAction: sendMessage,
}: {
	user: User;
	ticketId: string;
	getMessagesAction: () => Promise<SerializedTicketMessage[]>;
	getNextPageAction: (messageCount: number) => Promise<SerializedTicketMessage[]>;
	sendMessageAction: (message: string) => Promise<void>;
}) {
	const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessages>([]);

	return (
		<>
			<div className="grow max-w-[100rem] w-full">
				<Messages
					user={user}
					ticketId={ticketId}
					getMessagesAction={getMessages}
					getNextPageAction={getNextPage}
					optimisticMessages={optimisticMessages}
				/>
			</div>
			<MessageInput sendMessageAction={sendMessage} setOptimisticMessagesAction={setOptimisticMessages} />
		</>
	);
}
