import { auth } from '@/libs/auth';
import { SerializedTicketMessage } from '@/libs/serializeData';
import { NextRequest, NextResponse } from 'next/server';
import { getSSEWriter } from 'ts-sse';
import { TicketEvents } from '../../types';
import { ticketMessageEmitter } from './eventListener';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const session = await auth();
	// TODO: Auth

	const responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const notifier = getSSEWriter(writer, encoder) as TicketEvents;

	const onMessage = async (message: SerializedTicketMessage) => {
		notifier.update({ data: { type: 'new', message } });
	};
	ticketMessageEmitter.on(params.id, onMessage);

	req.signal.onabort = () => {
		ticketMessageEmitter.removeListener(params.id, onMessage);
		notifier.close({ data: {} });
	};

	// Return the response stream
	return new NextResponse(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache, no-transform',
		},
	});
}
