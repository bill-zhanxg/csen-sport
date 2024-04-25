'use client';

import { dayjs } from '@/libs/dayjs';
import { TicketsRecord } from '@/libs/xata';
import { JSONData, SelectedPick } from '@xata.io/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function TicketsList({
	tickets,
	timezone,
}: {
	tickets: JSONData<Readonly<SelectedPick<TicketsRecord, ['*']>>>[];
	timezone: string;
}) {
	const path = usePathname();
	const lastPath = path.split('/').pop();
	const [selected, setSelected] = useState(lastPath);

	return tickets.map((ticket) => (
		<div key={ticket.id} className="relative">
			{selected === ticket.id ? (
				<motion.div layoutId="nav-bar" className="w-full h-full absolute bg-base-200 rounded-lg" />
			) : null}
			<Link
				href={`/tickets/${ticket.id}`}
				className="relative flex justify-between py-2 px-4 w-full rounded-md cursor-pointer z-10 hover:bg-base-300/30"
				onClick={() => setSelected(ticket.id)}
                prefetch={false}
			>
				<div>
					<h3 className="text-xl font-bold">{ticket.title}</h3>
					<p>Latest text</p>
				</div>
				{/* TODO: change to latest message date, and relative */}
				<div>{dayjs.tz(ticket.xata.createdAt, timezone).format('LT')}</div>
			</Link>
		</div>
	));
}
