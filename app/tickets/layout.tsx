import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { CreateTicketButton } from './components/CreateTicketButton';
import { TicketsList } from './components/TicketsList';

const xata = getXataClient();

export default async function Tickets({ children }: { children: React.ReactNode }) {
	const session = await auth();
	if (!session) return Unauthorized();

	const tickets = await xata.db.tickets
		.filter({
			createdBy: session.user.id,
			closed: false,
		})
		.getAll();

	return (
		<div className="flex w-full h-full-nav overflow-auto">
			<div className="flex flex-col w-[30rem] max-w-[30rem] h-full p-4 overflow-auto">
				<CreateTicketButton />
				<div role="tablist" className="tabs tabs-boxed mb-2">
					<a role="tab" className="tab tab-active">
						Opened
					</a>
					<a role="tab" className="tab">
						Closed
					</a>
				</div>
				<TicketsList tickets={tickets.toSerializable()} timezone={session.user.timezone ?? ''} />
			</div>
			{children}
		</div>
	);
}
