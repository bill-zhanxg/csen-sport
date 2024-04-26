import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import NotFound from '@/app/not-found';
import { auth } from '@/libs/auth';
import { SerializedTicketMessage, serializeTicketMessage, serializeTicketMessages } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { MessageTab } from './components/MessagesTab';
import { ticketMessageEmitter } from './message-stream/eventListner';

export const revalidate = 0;

const xata = getXataClient();

export default async function TicketMessages({ params }: { params: { id: string } }) {
	const session = await auth();
	if (!session) return Unauthorized();

	const ticket_id = params.id;
	const ticket = await xata.db.tickets.read(ticket_id);
	if (!ticket) return NotFound();
	if (ticket.createdBy?.id !== session.user.id) return Unauthorized();

	async function getMessages(): Promise<SerializedTicketMessage[]> {
		'use server';
		const messages = await xata.db.ticket_messages
			.select(['*', 'sender.name', 'sender.email', 'sender.image'])
			.filter({ ticket_id })
			.sort('xata.createdAt')
			.getPaginated({
				pagination: {
					size: 100,
				},
			});
		return serializeTicketMessages(messages);
	}

	async function sendMessage(messageRaw: string) {
		'use server';
		const message = messageRaw.trim();
		if (!message || !session) return;
		const data = await xata.db.ticket_messages.create({
			ticket_id,
			sender: session.user.id,
			message,
		});
		ticketMessageEmitter.emit(ticket_id, serializeTicketMessage({ ...data, sender: session.user as any }));
	}

	// TODO: Mobile
	return (
		<div className="flex flex-col items-center w-full h-full p-8 pb-2 overflow-auto relative bg-base-200">
			<MessageTab user={session.user} ticketId={ticket_id} getMessages={getMessages} sendMessage={sendMessage} />
		</div>
	);
}
