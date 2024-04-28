'use client';

import { dayjs } from '@/libs/dayjs';
import { SerializedTicket } from '@/libs/serializeData';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { TicketEventType } from '../types';

export function TicketsList({
	getTickets,
	timezone,
}: {
	getTickets: (closed: boolean) => Promise<SerializedTicket[]>;
	timezone: string;
}) {
	const [tickets, setTickets] = useState<SerializedTicket[] | null | 'error'>(null);

	const path = usePathname();
	const lastPath = path.split('/').pop();
	const [selected, setSelected] = useState(lastPath);

	useEffect(() => {
		if (lastPath) setSelected(lastPath);
	}, [lastPath]);

	const params = useSearchParams();
	const closed = params.get('status') === 'closed';

	useEffect(() => {
		setTickets(null);
		getTickets(closed)
			.then(setTickets)
			.catch(() => setTickets('error'));
	}, [getTickets, closed]);

	useEffect(() => {
		const eventSource = new EventSource(`/tickets/ticket-stream`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as TicketEventType;
			console.log(data);
			// setMessages((prev) => {
			// 	if (prev === 'error') return prev;
			// 	return [...(prev ?? []), data.message];
			// });
		};

		return () => {
			eventSource.close();
		};
	}, []);

	return (
		<>
			<div role="tablist" className="tabs tabs-boxed mb-2">
				<Link href={`/tickets`} role="tab" className={`relative tab`}>
					{!closed && <motion.div layoutId="status" className="w-full h-full absolute bg-base-300 rounded-lg" />}
					<span className="relative z-10">Opened</span>
				</Link>
				<Link href={`/tickets?status=closed`} role="tab" className={`relative tab`}>
					{closed && <motion.div layoutId="status" className="w-full h-full absolute bg-base-300 rounded-lg" />}
					<span className="relative z-10">Closed</span>
				</Link>
			</div>
			{tickets === null ? (
				<div className="flex items-center justify-center h-full">
					<span className="loading loading-bars loading-lg"></span>
				</div>
			) : tickets === 'error' ? (
				<div className="flex flex-col items-center justify-center text-center h-full">
					<FaTriangleExclamation size={60} />
					<h2 className="text-3xl font-bold">Failed to load tickets</h2>
				</div>
			) : tickets.length < 1 ? (
				<div className="text-center">Looks empty</div>
			) : (
				tickets.map((ticket) => (
					<div key={ticket.id} className="relative">
						{selected === ticket.id && (
							<motion.div layoutId="nav-bar" className="w-full h-full absolute bg-base-200 rounded-lg" />
						)}
						<Link
							href={`/tickets/${ticket.id}`}
							className="relative flex justify-between py-2 px-4 w-full rounded-md cursor-pointer z-10 hover:bg-base-300/30"
							prefetch={false}
						>
							<div>
								<h3 className="text-xl font-bold">{ticket.title}</h3>
								<p>{ticket.latest_message?.message ?? '(No Message)'}</p>
							</div>
							{/* TODO: handle null */}
							<div>{dayjs.tz(ticket.latest_message?.createdAt, timezone).format('LT')}</div>
						</Link>
					</div>
				))
			)}
		</>
	);
}
