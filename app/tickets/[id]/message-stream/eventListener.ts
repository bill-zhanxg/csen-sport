import { SerializedTicketMessage } from '@/libs/serializeData';
import { EventEmitter } from 'events';

export type TicketMessageDataType = { message: string };

class TicketMessageEmitter extends EventEmitter {}
declare interface TicketMessageEmitter {
	on(event: string, listener: (data: SerializedTicketMessage) => void): this;
}

export const ticketMessageEmitter = new TicketMessageEmitter();
