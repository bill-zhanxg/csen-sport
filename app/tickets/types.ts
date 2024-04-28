import { SerializedTicket, SerializedTicketMessage } from '@/libs/serializeData';
import { EventNotifier } from 'ts-sse';

export type TicketMessageEventType = { type: 'new'; message: SerializedTicketMessage };

export type TicketMessageEvents = EventNotifier<{
	update: {
		data: TicketMessageEventType;
	};
	complete: {
		data: TicketMessageEventType;
	};
	close: {
		data: {};
	};
	error: {
		data: {};
	};
}>;

export type TicketEventType = { type: 'new-message'; message: SerializedTicketMessage; ticket: SerializedTicket };

export type TicketEvents = EventNotifier<{
	update: {
		data: TicketEventType;
	};
	complete: {
		data: TicketEventType;
	};
	close: {
		data: {};
	};
	error: {
		data: {};
	};
}>;
