'use server';

import { getXataClient } from '@/libs/xata';
import { ticketEmitter } from '../ticket-stream/eventListener';

const xata = getXataClient();

export async function toggleTicketStatus(id: string, close: boolean) {
	if (typeof id !== 'string' || typeof close !== 'boolean') return;
	const ticket = await xata.db.tickets.update(id, { closed: close });
	if (ticket?.createdBy?.id) {
		ticketEmitter.emit('toggle-status', {
			ticket_creator_id: ticket.createdBy.id,
			ticket_id: id,
		});
	}
}
