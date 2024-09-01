import { redisClient } from '@/libs/redis';
import {
    SerializedTicket,
    SerializedTicketMessage,
    serializedTicketMessageSchema,
    serializedTicketSchema,
} from '@/libs/serializeData';
import { z } from 'zod';

const publisher = redisClient.duplicate();
const subscriber = redisClient.duplicate();

const typeSchema = z.enum(['new', 'update']);

const messageSchema = z.object({
	type: typeSchema,
	message: serializedTicketMessageSchema,
	ticket: serializedTicketSchema,
});
const ticketSchema = z.object({
	type: typeSchema,
	ticket: serializedTicketSchema,
});

async function emitMessage(type: 'new' | 'update', message: SerializedTicketMessage, ticket: SerializedTicket) {
	// Pub/Sub Format:
	// key: `message`
	// value: { type, message, ticket }

	await publisher.publish(`message_${process.env.NODE_ENV}`, JSON.stringify({ type, message, ticket }));
}

async function emitTicket(type: 'new' | 'update', ticket: SerializedTicket) {
	// Pub/Sub Format:
	// key: `ticket`
	// value: { type, ticket }

	await publisher.publish('ticket_${process.env.NODE_ENV}', JSON.stringify({ type, ticket }));
}

function subscribeToMessages(callback: (data: z.infer<typeof messageSchema>) => void) {
	subscriber.subscribe(`message_${process.env.NODE_ENV}`);
	subscriber.on('message', (channel, message) => {
		// Channel is always `message`
		if (channel !== 'message') return;
		// Safe parse the message
		const data = messageSchema.safeParse(message);
		if (!data.success) return console.warn('Invalid message received:', message);
		callback(data.data);
	});
}

function subscribeToTickets(callback: (data: z.infer<typeof ticketSchema>) => void) {
	subscriber.subscribe(`ticket_${process.env.NODE_ENV}`);
	subscriber.on('message', (channel, message) => {
		// Channel is always `ticket`
		if (channel !== 'ticket') return;
		// Safe parse the message
		const data = ticketSchema.safeParse(message);
		if (!data.success) return console.warn('Invalid ticket received:', message);
		callback(data.data);
	});
}
