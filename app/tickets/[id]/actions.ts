'use server';
import { isDeveloper } from '@/libs/checkPermission';
import { serializeTicket, serializeTicketMessage } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { ticketEmitter } from '../ticket-stream/eventListener';
import { ticketMessageEmitter } from './message-stream/eventListener';
import { authC } from '@/app/cache';

const xata = getXataClient();

export async function toggleTicketStatus(id: string, close: boolean) {
	const session = await authC();
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
	const session = await authC();
	if (!session || typeof id !== 'string') return;
	await xata.db.ticket_messages.update(id, { seen: true });
	const message = await xata.db.ticket_messages.read(id, ['*', 'sender.name', 'sender.email', 'sender.image']);
	if (message) {
		ticketMessageEmitter.emit(message.ticket_id || '', {
			...serializeTicketMessage(message),
			type: 'update',
		});
		const ticket = await xata.db.tickets.read(message.ticket_id ?? '', ['*', 'latest_message.*']);
		if (ticket && ticket.createdBy?.id) {
			ticketEmitter.emit('update-message', {
				ticket_creator_id: ticket.createdBy.id,
				message: serializeTicketMessage(message),
				ticket: serializeTicket(ticket),
			});
		}
	}
}

export async function deleteTicket(id: string) {
	const session = await authC();
	if (!isDeveloper(session) || typeof id !== 'string') return;
	await xata.db.tickets.delete(id);
}
