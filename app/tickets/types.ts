import { SerializedTicketMessage } from '@/libs/serializeData';
import { EventNotifier } from 'ts-sse';

export type TicketEventType = { type: 'new'; message: SerializedTicketMessage };

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
