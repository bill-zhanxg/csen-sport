import { NextResponse } from 'next/server';
import { getSSEWriter } from 'ts-sse';

import { authC } from '@/app/cache';
import { isDeveloper } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';

import { ticketMessageEmitter } from './eventListener';

import type { SerializedTicketMessage } from '@/libs/serializeData';
import type { NextRequest} from 'next/server';
import type { TicketMessageEvents } from '../../types';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const xata = getXataClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const session = await authC();
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const ticket = await xata.db.tickets.read(id, ['createdBy.id']);
	if (!isDeveloper(session) && ticket?.createdBy?.id !== session.user.id)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const notifier = getSSEWriter(writer, encoder) as TicketMessageEvents;

	const onMessage = async (
		message: SerializedTicketMessage & {
			type: 'new' | 'update';
		},
	) => {
		if (message.type === 'new') notifier.update({ data: { type: 'new', message } });
		else if (message.type === 'update') notifier.update({ data: { type: 'update', message } });
	};

	ticketMessageEmitter.on(id, onMessage);
	req.signal.onabort = () => {
		ticketMessageEmitter.removeListener(id, onMessage);
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
