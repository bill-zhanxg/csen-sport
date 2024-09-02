import { authC } from '@/app/cache';
import { isDeveloper } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { NextRequest, NextResponse } from 'next/server';
import { getSSEWriter } from 'ts-sse';
import { subscribeToMessages } from '../../helper';
import { TicketMessageEvents } from '../../types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const xata = getXataClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const session = await authC();
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const ticket = await xata.db.tickets.read(params.id, ['createdBy.id']);
	if (!isDeveloper(session) && ticket?.createdBy?.id !== session.user.id)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const notifier = getSSEWriter(writer, encoder) as TicketMessageEvents;

	const subscriber = subscribeToMessages(({ type, message, ticket }) => {
		if (ticket.id !== params.id) return;
		notifier.update({ data: { type, message } });
	});

	req.signal.onabort = () => {
		subscriber.quit();
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
