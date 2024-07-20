'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { toggleTicketStatus } from '../actions';

export function ActionList({ ticketId, isDev }: { ticketId: string; isDev: boolean }) {
	const router = useRouter();
	const params = useSearchParams();
	const closed = params.get('status') === 'closed';

	return (
		<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
			<li>
				<button
					className={`bg-red-600 hover:bg-red-800 text-white rounded-lg px-4 py-2 text-sm w-full transition duration-200 active:bg-red-950${
						isDev ? ' rounded-b-none' : ''
					}`}
					onClick={async () => {
						router.push(`/tickets${closed ? '?status=closed' : ''}`);
						await toggleTicketStatus(ticketId, !closed);
					}}
				>
					{closed ? 'Reopen' : 'Close'} Ticket
				</button>
			</li>
			{isDev && (
				<li>
					<button
						className="bg-yellow-600 hover:bg-yellow-800 text-white rounded-lg px-4 py-2 text-sm w-full transition duration-200 active:bg-yellow-950 rounded-t-none"
						onClick={async () => {
							router.push(`/tickets${closed ? '?status=closed' : ''}`);
							await toggleTicketStatus(ticketId, !closed);
						}}
					>
						Delete Ticket
					</button>
				</li>
			)}
		</ul>
	);
}
