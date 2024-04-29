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

	const allowPass = (creator: string) => {
		if (isDeveloper(session) || creator === session.user.id) return true;
		return false;
	};

	const onMessage = async ({
		ticket_creator_id,
		message,
		ticket,
	}: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => {
		if (allowPass(ticket_creator_id)) notifier.update({ data: { type: 'new-message', message, ticket } });
	};
	ticketEmitter.on('new-message', onMessage);

	const onNewTicket = async ({
		ticket,
	}: {
		ticket: SerializedTicket & {
			creatorId: string;
		};
	}) => {
		if (allowPass(ticket.creatorId)) notifier.update({ data: { type: 'new', ticket } });
	};
	ticketEmitter.on('new-ticket', onNewTicket);

	const onCloseTicket = async ({ ticket_creator_id, ticket_id }: { ticket_creator_id: string; ticket_id: string }) => {
		console.log('received + emitting toggle-status');
		if (allowPass(ticket_creator_id)) notifier.update({ data: { type: 'toggle-status', ticket_id } });
	};
	ticketEmitter.on('toggle-status', onCloseTicket);

	req.signal.onabort = () => {
		ticketEmitter.removeListener('new-message', onMessage);
		ticketEmitter.removeListener('new', onNewTicket);
		ticketEmitter.removeListener('toggle-status', onCloseTicket);
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
