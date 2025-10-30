/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { SerializedTicketMessage } from '@/libs/serializeData';
import '../actions';

import { EventEmitter } from 'events';

type Listener = (
	data: SerializedTicketMessage & {
		type: 'new' | 'update';
	},
) => void;

class TicketMessageEmitter extends EventEmitter {
	constructor() {
		super();
	}
}
declare interface TicketMessageEmitter {
	on(event: string, listener: Listener): this;
	emit(event: string, listener: Parameters<Listener>[0]): boolean;
}

export const ticketMessageEmitter = new TicketMessageEmitter();
