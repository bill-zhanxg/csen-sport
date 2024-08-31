import { authC } from '@/app/cache';
import { isDeveloper } from '@/libs/checkPermission';
import { SerializedTicket, serializeTickets } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { redirect } from 'next/navigation';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { LeftBar } from './components/LeftBar';
import { ticketEmitter } from './ticket-stream/eventListener';

const xata = getXataClient();

export default async function Tickets({ children }: { children: React.ReactNode }) {
	const session = await authC();
	if (!session) return Unauthorized();

	async function getPaginatedTickets(closed?: boolean, offset?: number) {
		'use server';
		if (!session) return undefined;
		if (closed === undefined) closed = false;

		return xata.db.tickets
			.filter({
				createdBy: isDeveloper(session) ? undefined : session.user.id,
				closed,
			})
			.select(['*', 'latest_message.*'])
			.sort('latest_message.xata.createdAt', 'desc')
			.sort('xata.createdAt', 'desc')
			.getPaginated({
				pagination: {
					offset,
					size: 50,
				},
			});
	}
	async function getTickets(closed?: boolean) {
		'use server';
		const tickets = await getPaginatedTickets(closed);
		if (!tickets) return [];
		return serializeTickets(tickets);
	}
	async function getNextPage(closed: boolean, messageCount: number): Promise<SerializedTicket[]> {
		'use server';
		if (typeof messageCount !== 'number') return [];
		const tickets = await getPaginatedTickets(closed, messageCount);
		if (!tickets) return [];
		return serializeTickets(tickets);
	}

	async function createTicket(data: FormData) {
		'use server';
		const session = await authC();
		const title = data.get('title');
		if (!title || typeof title !== 'string' || !session) return;

		const { id } = await xata.db.tickets.create({
			title: title,
			createdBy: session.user.id,
		});

		ticketEmitter.emit('new-ticket', {
			ticket: {
				id,
				title,
				creatorId: session.user.id,
			},
		});

		redirect(`/tickets/${id}`);
	}

	return (
		<div className="flex w-full h-full-nav overflow-auto">
			<LeftBar
				createTicket={createTicket}
				getTickets={getTickets}
				getNextPage={getNextPage}
				timezone={session.user.timezone ?? ''}
				session={session}
			/>
			{children}
		</div>
	);
}
