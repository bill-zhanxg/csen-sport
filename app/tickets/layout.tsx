import { auth } from '@/libs/auth';
import { CreateTicketButton } from './components/CreateTicketButton';

export default async function Tickets({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<div className="flex w-full h-full-nav overflow-auto">
			<div className="flex flex-col w-[30rem] max-w-[30rem] h-full p-4 overflow-auto">
				<CreateTicketButton />
				<div role="tablist" className="tabs tabs-boxed mb-2">
					<a role="tab" className="tab tab-active">
						Opened
					</a>
					<a role="tab" className="tab">
						Closed
					</a>
				</div>
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className={`flex justify-between py-2 px-4 w-full rounded-md ${
							i === 1 ? 'bg-base-200 hover:bg-base-300' : 'hover:bg-base-200'
						}`}
					>
						<div>
							<h3 className="text-xl font-bold">Title</h3>
							<p>Latest text</p>
						</div>
						<div>16/16/1616</div>
					</div>
				))}
			</div>
			{children}
		</div>
	);
}
