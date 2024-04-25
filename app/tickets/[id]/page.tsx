import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { auth } from '@/libs/auth';
import { SerializedTicketMessage, serializeTicketMessage, serializeTicketMessages } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { MessageInput } from './components/MessageInput';
import { Messages } from './components/Messages';
import { ticketMessageEmitter } from './message-stream/eventListner';

export const revalidate = 0;

const xata = getXataClient();

export default async function TicketMessages({ params }: { params: { id: string } }) {
	const session = await auth();
	if (!session) return Unauthorized();

	const ticket_id = params.id;

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

	async function sendMessage(message: string) {
		'use server';
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
			<div className="grow max-w-[100rem] w-full">
				<Messages user={session.user} ticketId={ticket_id} getMessages={getMessages} />
			</div>
			<MessageInput sendMessage={sendMessage} />
		</div>
	);
}
