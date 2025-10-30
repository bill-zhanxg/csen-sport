import { NextResponse } from 'next/server';
import { getSSEWriter } from 'ts-sse';

import { authC } from '@/app/cache';
import { isDeveloper } from '@/libs/checkPermission';

import { ticketEmitter } from './eventListener';

import type { SerializedTicket, SerializedTicketMessage } from '@/libs/serializeData';
import type { NextRequest } from 'next/server';
import type { TicketEvents } from '../types';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	const session = await authC();
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

	const updateMessage = async ({
		ticket_creator_id,
		message,
		ticket,
	}: {
		ticket_creator_id: string;
		message: SerializedTicketMessage;
		ticket: SerializedTicket;
	}) => {
		if (allowPass(ticket_creator_id)) notifier.update({ data: { type: 'update-message', message, ticket } });
	};

	const onNewTicket = async ({
		ticket,
	}: {
		ticket: SerializedTicket & {
			creatorId: string;
		};
	}) => {
		if (allowPass(ticket.creatorId)) notifier.update({ data: { type: 'new', ticket } });
	};

	const onCloseTicket = async ({ ticket_creator_id, ticket_id }: { ticket_creator_id: string; ticket_id: string }) => {
		if (allowPass(ticket_creator_id)) notifier.update({ data: { type: 'toggle-status', ticket_id } });
	};

	ticketEmitter.on('new-message', onMessage);
	ticketEmitter.on('update-message', updateMessage);
	ticketEmitter.on('new-ticket', onNewTicket);
	ticketEmitter.on('toggle-status', onCloseTicket);

	req.signal.onabort = () => {
		ticketEmitter.removeListener('new-message', onMessage);
		ticketEmitter.removeListener('update-message', updateMessage);
		ticketEmitter.removeListener('new-ticket', onNewTicket);
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
