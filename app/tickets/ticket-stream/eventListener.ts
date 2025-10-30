/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { SerializedTicket, SerializedTicketMessage } from '@/libs/serializeData';
import '../[id]/actions';

import { EventEmitter } from 'events';

interface TicketEventType {
	'new-message': (data: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => void;
	'update-message': (data: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => void;
	'new-ticket': (data: {
		ticket: SerializedTicket & {
			creatorId: string;
		};
	}) => void;
	'toggle-status': (data: { ticket_creator_id: string; ticket_id: string }) => void;
}

class TicketEmitter extends EventEmitter {
	constructor() {
		super();
	}
}
declare interface TicketEmitter {
	on<U extends keyof TicketEventType>(event: U, listener: TicketEventType[U]): this;
	emit<U extends keyof TicketEventType>(event: U, ...args: Parameters<TicketEventType[U]>): boolean;
}

export const ticketEmitter = new TicketEmitter();
