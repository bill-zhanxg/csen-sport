import { SerializedTicketMessage } from '@/libs/serializeData';
import { EventEmitter } from 'events';

class TicketMessageEmitter extends EventEmitter {
	constructor() {
		super();
	}
}
declare interface TicketMessageEmitter {
	on(event: string, listener: (data: SerializedTicketMessage) => void): this;
}

export const ticketMessageEmitter = new TicketMessageEmitter();
