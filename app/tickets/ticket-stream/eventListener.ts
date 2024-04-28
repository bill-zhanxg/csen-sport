import { SerializedTicket, SerializedTicketMessage } from '@/libs/serializeData';
import { EventEmitter } from 'events';

interface TicketEventType {
	'new-message': (data: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => void;
}

class TicketEmitter extends EventEmitter {}
declare interface TicketEmitter {
	on<U extends keyof TicketEventType>(event: U, listener: TicketEventType[U]): this;
	emit<U extends keyof TicketEventType>(event: U, ...args: Parameters<TicketEventType[U]>): boolean;
}

export const ticketEmitter = new TicketEmitter();
