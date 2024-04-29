import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import NotFound from '@/app/not-found';
import { auth } from '@/libs/auth';
import { SerializedTicketMessage, serializeTicketMessage, serializeTicketMessages } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { ticketEmitter } from '../ticket-stream/eventListener';
import { MessageTab } from './components/MessagesTab';
import { ticketMessageEmitter } from './message-stream/eventListener';
import { ActionList } from './components/ActionList';

export const revalidate = 0;

const xata = getXataClient();

export default async function TicketMessages({ params }: { params: { id: string } }) {
	const session = await auth();
	if (!session) return Unauthorized();

	const ticket_id = params.id;
	const ticket = await xata.db.tickets.read(ticket_id);
	if (!ticket) return NotFound();
	if (ticket.createdBy?.id !== session.user.id) return Unauthorized();
	const serializedTicket = {
		id: ticket.id,
		title: ticket.title,
	};
	const ticket_creator = ticket.createdBy.id;

	async function getPaginatedMessages(offset?: number) {
		'use server';
		return xata.db.ticket_messages
			.select(['*', 'sender.name', 'sender.email', 'sender.image'])
			.filter({ ticket_id })
			.sort('xata.createdAt', 'desc')
			.getPaginated({
				pagination: {
					offset,
					size: 20,
				},
			});
	}
	async function getMessages(): Promise<SerializedTicketMessage[]> {
		'use server';
		const messages = await getPaginatedMessages();
		return serializeTicketMessages(messages);
	}
	async function getNextPage(messageCount: number): Promise<SerializedTicketMessage[]> {
		'use server';
		if (typeof messageCount !== 'number') return [];
		const messages = await getPaginatedMessages(messageCount);
		return serializeTicketMessages(messages);
	}

	async function sendMessage(messageRaw: string) {
		'use server';
		const message = messageRaw.trim();
		if (!message || !session || !ticket_id) return;
		const data = await xata.db.ticket_messages.create({
			ticket_id,
			sender: session.user.id,
			message,
		});
		ticketMessageEmitter.emit(ticket_id, serializeTicketMessage({ ...data, sender: session.user as any }));
		ticketEmitter.emit('new-message', {
			ticket_creator_id: ticket_creator,
			message: serializeTicketMessage({ ...data, sender: session.user as any }),
			ticket: serializedTicket,
		});

		await xata.db.tickets.update({
			id: ticket_id,
			latest_message: data.id,
		});
	}

	// TODO: Mobile
	return (
		<div id="chat" className="flex flex-col items-center w-full h-full px-8 py-2 overflow-auto relative bg-base-200">
			<div className="flex justify-between sticky top-0 w-full bg-base-100 z-10 py-2 px-4 rounded-lg">
				<div className="flex items-center gap-2 text-center">
					<FaRegQuestionCircle size={40} />
					<h2 className="text-3xl font-bold">{ticket.title}</h2>
				</div>
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn">
						<FaEllipsisVertical />
					</div>
					<ActionList 
						ticketId={ticket_id}
					/>
				</div>
			</div>
			<MessageTab
				user={session.user}
				ticketId={ticket_id}
				getMessages={getMessages}
				getNextPage={getNextPage}
				sendMessage={sendMessage}
			/>
		</div>
	);
}
