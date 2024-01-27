'use client';

export function Danger() {
	return (
		<div className="join join-vertical xl:join-horizontal w-full xl:w-auto [&>button]:btn-error">
			<button
				className="btn join-item"
				onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
			>
				Reset Everything
			</button>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all games, teams, and venues from the database. This action is
						irreversible and should only be used when a semester is over. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button className="btn btn-error">Yes</button>
						<form method="dialog">
							<button className="btn">No</button>
						</form>
					</div>
				</div>
			</dialog>
			<button
				className="btn join-item"
				onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
			>
				Reset All Games
			</button>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all games from the database. This action is irreversible and should not be
						used unless necessary. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button className="btn btn-error">Yes</button>
						<form method="dialog">
							<button className="btn">No</button>
						</form>
					</div>
				</div>
			</dialog>
			<button
				className="btn join-item"
				onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
			>
				Reset All Teams
			</button>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all teams from the database. This action is irreversible and should not be
						used unless necessary. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button className="btn btn-error">Yes</button>
						<form method="dialog">
							<button className="btn">No</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all venues from the database. This action is irreversible and should not be
						used unless necessary. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button className="btn btn-error">Yes</button>
						<form method="dialog">
							<button className="btn">No</button>
						</form>
					</div>
				</div>
			</dialog>
			<button
				className="btn join-item"
				onClick={(event) => (event.currentTarget.previousSibling as HTMLDialogElement).showModal()}
			>
				Reset All Venues
			</button>
		</div>
	);
}
