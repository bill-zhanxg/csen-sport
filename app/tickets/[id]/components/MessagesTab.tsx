'use client';

import { SerializedTicketMessage } from '@/libs/serializeData';
import { User } from 'next-auth';
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
	getMessages,
	getNextPage,
	sendMessage,
}: {
	user: User;
	ticketId: string;
	getMessages: () => Promise<SerializedTicketMessage[]>;
	getNextPage: (messageCount: number) => Promise<SerializedTicketMessage[]>;
	sendMessage: (message: string) => Promise<void>;
}) {
	const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessages>([]);

	return (
		<>
			<div className="grow max-w-[100rem] w-full">
				<Messages user={user} ticketId={ticketId} getMessages={getMessages} getNextPage={getNextPage} optimisticMessages={optimisticMessages} />
			</div>
			<MessageInput sendMessage={sendMessage} setOptimisticMessages={setOptimisticMessages} />
		</>
	);
}
