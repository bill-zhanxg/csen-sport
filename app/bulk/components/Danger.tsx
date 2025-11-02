'use client';

import { useState } from 'react';

import { showToast } from '@/app/components/Alert';

import { resetAll, resetGames, resetTeams } from '../actions';

export function Danger() {
	const [allLoading, setAllLoading] = useState(false);
	const [gameLoading, setGameLoading] = useState(false);
	const [teamLoading, setTeamLoading] = useState(false);

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
						<button
							className="btn btn-error"
							disabled={allLoading}
							onClick={async (e) => {
									e.preventDefault();
									const dialog = (e.currentTarget.closest('dialog') as HTMLDialogElement | null);
									setAllLoading(true);
									const res = await resetAll();
									showToast(res);
									setAllLoading(false);
									dialog?.close();
							}}
						>
							Yes
						</button>
						<form method="dialog">
							<button className="btn" disabled={allLoading}>
								No
							</button>
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
						You&apos;re about to reset (remove) all games from the database. This action is irreversible and should not
						be used unless necessary. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={gameLoading}
							onClick={async (e) => {
									e.preventDefault();
									const dialog = (e.currentTarget.closest('dialog') as HTMLDialogElement | null);
									setGameLoading(true);
									const res = await resetGames();
									showToast(res);
									setGameLoading(false);
									dialog?.close();
							}}
						>
							Yes
						</button>
						<form method="dialog">
							<button className="btn" disabled={gameLoading}>
								No
							</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all teams from the database. This action is irreversible and should not
						be used unless necessary. Are you sure you want to continue?
					</p>
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={teamLoading}
							onClick={async (e) => {
									e.preventDefault();
									const dialog = (e.currentTarget.closest('dialog') as HTMLDialogElement | null);
									setTeamLoading(true);
									const res = await resetTeams();
									showToast(res);
									setTeamLoading(false);
									dialog?.close();
							}}
						>
							Yes
						</button>
						<form method="dialog">
							<button className="btn" disabled={teamLoading}>
								No
							</button>
						</form>
					</div>
				</div>
			</dialog>
			<button
				className="btn join-item"
				onClick={(event) => (event.currentTarget.previousElementSibling as HTMLDialogElement).showModal()}
			>
				Reset All Teams
			</button>
		</div>
	);
}
