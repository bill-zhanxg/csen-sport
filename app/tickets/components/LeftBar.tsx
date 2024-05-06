'use client';

import { SerializedTicket } from '@/libs/serializeData';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateTicketButton } from './CreateTicketButton';
import { TicketsList } from './TicketsList';
import { Session } from 'next-auth';

export function LeftBar({
	createTicket,
	getTickets,
	getNextPage,
	timezone,
	session
}: {
	createTicket: (data: FormData) => void;
	getTickets: (closed: boolean) => Promise<SerializedTicket[]>;
	getNextPage: (closed: boolean, messageCount: number) => Promise<SerializedTicket[]>;
	timezone: string;
	session: Session;
}) {
	const path = usePathname();
	const lastPath = path.split('/').pop();
	const [selected, setSelected] = useState(lastPath);

	useEffect(() => {
		if (lastPath) setSelected(lastPath);
	}, [lastPath]);

	return (
		<div
			id="tickets"
			className={`flex-col w-[30rem] grow sm:max-w-[30rem] h-full p-4 overflow-x-hidden ${
				selected === 'tickets' ? 'flex' : 'hidden sm:flex'
			}`}
		>
			<CreateTicketButton createTicket={createTicket} />
			<TicketsList getTickets={getTickets} getNextPage={getNextPage} timezone={timezone} session={session} />
		</div>
	);
}
