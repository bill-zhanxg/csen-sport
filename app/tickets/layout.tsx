import { auth } from '@/libs/auth';
import { isDeveloper } from '@/libs/checkPermission';
import { SerializedTicket, serializeTickets } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { CreateTicketButton } from './components/CreateTicketButton';
import { TicketsList } from './components/TicketsList';

const xata = getXataClient();

export default async function Tickets({ children }: { children: React.ReactNode }) {
	const session = await auth();
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
			.select(['*', 'latest_message.message', 'latest_message.xata.createdAt'])
			.getPaginated({
				pagination: {
					offset,
					size: 20,
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

	return (
		<div className="flex w-full h-full-nav overflow-auto">
			<div className="flex flex-col w-[30rem] max-w-[30rem] h-full p-4 overflow-auto">
				<CreateTicketButton />
				<TicketsList getTickets={getTickets} timezone={session.user.timezone ?? ''} />
			</div>
			{children}
		</div>
	);
}
