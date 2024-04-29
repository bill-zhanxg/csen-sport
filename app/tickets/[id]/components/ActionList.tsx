'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { toggleTicketStatus } from '../actions';

export function ActionList({ ticketId }: { ticketId: string }) {
	const router = useRouter();
	const params = useSearchParams();
	const closed = params.get('status') === 'closed';

	return (
		<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
			<li>
				<button
					type="submit"
					className="bg-red-600 hover:bg-red-800 text-white rounded-lg px-4 py-2 text-sm w-full transition duration-200 active:bg-red-950"
					onClick={async () => {
						router.push(`/tickets${closed ? '?status=closed' : ''}`);
						await toggleTicketStatus(ticketId, !closed);
					}}
				>
					{closed ? 'Reopen' : 'Close'} Ticket
				</button>
			</li>
		</ul>
	);
}
