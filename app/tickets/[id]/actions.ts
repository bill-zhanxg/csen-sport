'use server';

import { auth } from '@/libs/auth';
import { serializeTicketMessage } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { ticketEmitter } from '../ticket-stream/eventListener';
import { ticketMessageEmitter } from './message-stream/eventListener';

const xata = getXataClient();

export async function toggleTicketStatus(id: string, close: boolean) {
	const session = await auth();
	if (!session || typeof id !== 'string' || typeof close !== 'boolean') return;
	const ticket = await xata.db.tickets.update(id, { closed: close });
	if (ticket?.createdBy?.id) {
		ticketEmitter.emit('toggle-status', {
			ticket_creator_id: ticket.createdBy.id,
			ticket_id: id,
		});
	}
}

export async function markMessageAsSeen(id: string) {
	const session = await auth();
	if (!session || typeof id !== 'string') return;
	await xata.db.ticket_messages.update(id, { seen: true });
	const message = await xata.db.ticket_messages.read(id, ['*', 'sender.name', 'sender.email', 'sender.image']);
	if (message)
		ticketMessageEmitter.emit(message.ticket_id || '', {
			...serializeTicketMessage(message),
			type: 'update',
		});
}
