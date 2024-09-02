import { authC } from '@/app/cache';
import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import NotFound from '@/app/not-found';
import { isDeveloper } from '@/libs/checkPermission';
import { redisClient } from '@/libs/redis';
import {
	SerializedTicketMessage,
	serializeTicket,
	serializeTicketMessage,
	serializeTicketMessages,
} from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import Pusher from 'pusher';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { ticketEmitter } from '../ticket-stream/eventListener';
import { ActionList } from './components/ActionList';
import { MessageTab } from './components/MessagesTab';
import { ticketMessageEmitter } from './message-stream/eventListener';

export const revalidate = 0;

const xata = getXataClient();
const redisC = redisClient.duplicate();

export default async function TicketMessages({ params }: { params: { id: string } }) {
	const session = await authC();
	if (!session) return Unauthorized();

	const ticket_id = params.id;
	const ticket = await xata.db.tickets.read(ticket_id);
	if (!ticket) return NotFound();
	if (!ticket.createdBy || (!isDeveloper(session) && ticket.createdBy?.id !== session.user.id)) return Unauthorized();
	const serializedTicket = {
		id: ticket.id,
		title: ticket.title,
		closed: ticket.closed,
	};
	const ticket_creator = ticket.createdBy.id;
	const creator = isDeveloper(session) ? await ticket.createdBy.read() : undefined;

	async function getPaginatedMessages(offset?: number) {
		'use server';
		const messages = await xata.db.ticket_messages
			.select(['*', 'sender.name', 'sender.email', 'sender.image'])
			.filter({ ticket_id })
			.sort('xata.createdAt', 'desc')
			.getPaginated({
				pagination: {
					offset,
					size: 20,
				},
			});
		const ticket = await xata.db.tickets.read(ticket_id, ['*', 'latest_message.*']);

		// Mark messages as seen
		const unseenMessages = messages.records
			.filter((message) => !message.seen && message.sender?.id !== session?.user.id)
			.map((message) => message.id);
		xata.transactions.run(
			unseenMessages.map((id) => ({
				update: {
					id: id,
					table: 'ticket_messages',
					fields: {
						seen: true,
					},
				},
			})),
		);
		messages.records.forEach((oldMessage, index) => {
			const message = {
				...oldMessage,
				seen: true,
			};
			if (unseenMessages.includes(message.id)) {
				ticketMessageEmitter.emit(ticket_id, {
					...serializeTicketMessage(message),
					type: 'update',
				});
				if (ticket && ticket.createdBy?.id) {
					ticketEmitter.emit('update-message', {
						ticket_creator_id: ticket.createdBy.id,
						message: serializeTicketMessage(message),
						ticket: serializeTicket(ticket),
					});
				}
				messages.records[index] = message;
			}
		});

		return messages;
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
		await redisC.publish(
			'ticket-message',
			JSON.stringify({
				...serializeTicketMessage({ ...data, sender: session.user as any }),
				type: 'new',
			}),
		);
		ticketMessageEmitter.emit(ticket_id, {
			...serializeTicketMessage({ ...data, sender: session.user as any }),
			type: 'new',
		});
		ticketEmitter.emit('new-message', {
			ticket_creator_id: ticket_creator,
			message: serializeTicketMessage({ ...data, sender: session.user as any }),
			ticket: serializedTicket,
		});

		const pusher = new Pusher({
			appId: process.env.PUSHER_APP_ID,
			key: process.env.NEXT_PUBLIC_PUSHER_KEY,
			secret: process.env.PUSHER_SECRET,
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
			useTLS: true,
		});

		pusher.trigger('my-channel', 'my-event', {
			message,
		});

		await xata.db.tickets.update({
			id: ticket_id,
			latest_message: data.id,
		});
	}

	return (
		<div id="chat" className="flex flex-col items-center w-full h-full px-8 py-2 overflow-auto relative bg-base-200">
			<div className="flex justify-between sticky top-0 w-full bg-base-100 z-10 py-2 px-4 rounded-lg">
				<div className="flex items-center gap-2 text-center">
					{isDeveloper(session) && creator ? (
						<label tabIndex={0} className="w-12 h-12 avatar">
							<UserAvatar user={creator} className="rounded-full" />
						</label>
					) : (
						<FaRegQuestionCircle size={40} />
					)}
					<h2 className="text-3xl font-bold">{ticket.title}</h2>
				</div>
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn">
						<FaEllipsisVertical />
					</div>
					<ActionList ticketId={ticket_id} isDev={isDeveloper(session)} />
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
