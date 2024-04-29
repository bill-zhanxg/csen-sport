'use client';

import { dayjs } from '@/libs/dayjs';
import { SerializedTicket } from '@/libs/serializeData';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { TicketEventType } from '../types';

export function TicketsList({
	getTickets,
	getNextPage,
	timezone,
}: {
	getTickets: (closed: boolean) => Promise<SerializedTicket[]>;
	getNextPage: (closed: boolean, messageCount: number) => Promise<SerializedTicket[]>;
	timezone: string;
}) {
	const [tickets, setTickets] = useState<SerializedTicket[] | null | 'error'>(null);

	const path = usePathname();
	const lastPath = path.split('/').pop();
	const [selected, setSelected] = useState(lastPath);

	const ticketElement = useRef<HTMLElement | null>(null);
	const [isBottom, setIsBottom] = useState(false);
	const [loadingTickets, setLoadingTickets] = useState<boolean | null | 'error'>(true);

	useEffect(() => {
		if (lastPath) setSelected(lastPath);
	}, [lastPath]);

	const params = useSearchParams();
	const closed = params.get('status') === 'closed';

	useEffect(() => {
		const t = document.getElementById('tickets');
		// Set ref after load
		ticketElement.current = t;

		setTickets(null);
		getTickets(closed)
			.then((tickets) => {
				setTickets(tickets);
				// Prevent message not loading if the the screen is very tall
				if (t) setIsBottom(t.scrollHeight - t.clientHeight <= t.scrollTop + 1);
				setLoadingTickets(false);
			})
			.catch(() => setTickets('error'));

		if (t) {
			t.onscroll = () => {
				setIsBottom(t.scrollHeight - t.clientHeight <= t.scrollTop + 1);
			};

			return () => {
				t.onscroll = null;
			};
		}
	}, [getTickets, closed]);

	useEffect(() => {
		const eventSource = new EventSource(`/tickets/ticket-stream`);
		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as TicketEventType;
			if (data.type === 'new-message') {
				setTickets((prev) => {
					if (!prev || prev === 'error') return prev;
					const updateIndex = prev.findIndex((ticket) => ticket.id === data.ticket.id);
					if (updateIndex === -1)
						return [
							{
								id: data.ticket.id,
								title: data.ticket.title,
								latest_message: {
									message: data.message.message,
									createdAt: data.message.xata.createdAt,
								},
							},
							...prev,
						];

					prev[updateIndex].latest_message = {
						message: data.message.message,
						createdAt: data.message.xata.createdAt,
					};
					// Move it to front
					prev.unshift(prev.splice(updateIndex, 1)[0]);
					return [...prev];
				});
			} else if (data.type === 'new') {
				setTickets((prev) => {
					if (!prev || prev === 'error') return prev;
					return [
						{
							id: data.ticket.id,
							title: data.ticket.title,
							latest_message: null,
						},
						...prev,
					];
				});
			}
		};

		return () => {
			eventSource.close();
		};
	}, []);

	useEffect(() => {
		if (isBottom) {
			if (loadingTickets !== false || !tickets) return;
			setIsBottom(false);
			setLoadingTickets(true);
			getNextPage(closed, tickets.length)
				.then((newTickets) => {
					if (newTickets.length < 1) return setLoadingTickets(null);
					setTickets((prev) => {
						if (!prev || prev === 'error') return prev;
						newTickets = newTickets.filter((ticket) => !prev.map((t) => t.id).includes(ticket.id));
						return [...prev, ...newTickets];
					});
					setLoadingTickets(false);
				})
				.catch(() => setLoadingTickets('error'));
		}
	}, [isBottom, closed, tickets, loadingTickets, getNextPage]);

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
				tickets.map((ticket) => {
					const datetime = ticket.latest_message?.createdAt
						? dayjs.tz(ticket.latest_message.createdAt, timezone)
						: undefined;
					return (
						<div key={ticket.id} className="relative">
							{selected === ticket.id && (
								<motion.div layoutId="nav-bar" className="w-full h-full absolute bg-base-200 rounded-lg" />
							)}
							<Link
								href={`/tickets/${ticket.id}`}
								className="relative flex justify-between gap-4 py-2 px-4 w-full rounded-md cursor-pointer z-10 hover:bg-base-300/30 min-w-0"
								prefetch={false}
							>
								<div className="overflow-hidden">
									<h3 className="text-xl font-bold text-ellipsis overflow-hidden">{ticket.title}</h3>
									<p className="text-ellipsis overflow-hidden">{ticket.latest_message?.message ?? '(No Message)'}</p>
								</div>
								<div className="min-w-fit">
									{datetime ? (
										<div className="tooltip" data-tip={datetime.format('DD/MM/YYYY LT')}>
											{datetime.isToday()
												? datetime.format('LT')
												: datetime.isYesterday()
												? 'Yesterday'
												: datetime.format('DD/MM/YYYY')}
										</div>
									) : (
										'----'
									)}
								</div>
							</Link>
						</div>
					);
				})
			)}
			{loadingTickets === null ? (
				<div className="flex items-center justify-center h-10">You&apos;re at the bottom</div>
			) : loadingTickets === 'error' ? (
				<div className="flex items-center justify-center h-10">There is an error loading tickets</div>
			) : (
				loadingTickets && (
					<div className="flex items-center justify-center h-10">
						<span className="loading loading-bars loading-md"></span>
					</div>
				)
			)}
		</>
	);
}
