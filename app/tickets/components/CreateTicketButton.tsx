'use client';

export function CreateTicketButton() {
	return (
		<div className="flex flex-col gap-2 mb-2">
			<button className="btn btn-primary w-full">Create Ticket</button>
			<div className="bg-base-200 rounded-lg border-2 p-2">
				<h2 className="text-center font-bold">New Ticket</h2>
				<label className="form-control w-full max-w-xs">
					<span className="label-text">Ticket Title</span>
					<input type="text" placeholder="Type here" className="input input-bordered input-sm w-full" />
				</label>
			</div>
		</div>
	);
}
