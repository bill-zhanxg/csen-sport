import { auth } from '@/libs/auth';
import { isDeveloper } from '@/libs/checkPermission';
import { SerializedTicket, SerializedTicketMessage } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { NextRequest, NextResponse } from 'next/server';
import { getSSEWriter } from 'ts-sse';
import { TicketEvents } from '../types';
import { ticketEmitter } from './eventListener';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const xata = getXataClient();

export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const notifier = getSSEWriter(writer, encoder) as TicketEvents;

	const onMessage = async ({
		ticket_creator_id,
		message,
		ticket,
	}: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => {
		if (isDeveloper(session) || ticket_creator_id === session.user.id)
			notifier.update({ data: { type: 'new-message', message, ticket } });
	};
	ticketEmitter.on('new-message', onMessage);

	req.signal.onabort = () => {
		ticketEmitter.removeListener('new-message', onMessage);
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
