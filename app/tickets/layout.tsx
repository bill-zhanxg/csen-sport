import { auth } from '@/libs/auth';
import { isDeveloper } from '@/libs/checkPermission';
import { DatabaseSchema, getXataClient } from '@/libs/xata';
import { Model, XataDialect } from '@xata.io/kysely';
import { Kysely } from 'kysely';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { CreateTicketButton } from './components/CreateTicketButton';
import { TicketsList } from './components/TicketsList';

const xata = getXataClient();
const db = new Kysely<Model<DatabaseSchema>>({
	dialect: new XataDialect({ xata }),
});

export default async function Tickets({ children }: { children: React.ReactNode }) {
	const session = await auth();
	if (!session) return Unauthorized();

	async function getTickets(closed?: boolean) {
		'use server';
		if (!session) return [];
		if (closed === undefined) closed = false;

		const tickets = await xata.db.tickets
			.filter({
				createdBy: session.user.id,
				closed,
			})
			.getAll();
		const query = db
			.selectFrom('tickets')
			.where('createdBy', '=', isDeveloper(session) ? undefined : session.user.id)
			.where('closed', '=', closed);

		return tickets.toSerializable();
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
