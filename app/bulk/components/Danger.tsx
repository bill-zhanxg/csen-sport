'use client';

import { AlertType, ErrorAlert, SuccessAlert } from '@/app/components/Alert';
import { useState } from 'react';
import { resetAll, resetGames, resetTeams, resetVenues } from '../actions';

export function Danger() {
	const [allState, setAllState] = useState<AlertType>(null);
	const [allLoading, setAllLoading] = useState(false);
	const [gameState, setGameState] = useState<AlertType>(null);
	const [gameLoading, setGameLoading] = useState(false);
	const [teamState, setTeamState] = useState<AlertType>(null);
	const [teamLoading, setTeamLoading] = useState(false);
	const [venueState, setVenueState] = useState<AlertType>(null);
	const [venueLoading, setVenueLoading] = useState(false);

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
					{allState && (allState.type === 'error' ? ErrorAlert(allState) : SuccessAlert(allState))}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={allLoading}
							onClick={async (e) => {
								e.preventDefault();
								setAllLoading(true);
								const res = await resetAll();
								setAllState(res);
								setAllLoading(false);
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
					{gameState && (gameState.type === 'error' ? ErrorAlert(gameState) : SuccessAlert(gameState))}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={gameLoading}
							onClick={async (e) => {
								e.preventDefault;
								setGameLoading(true);
								const res = await resetGames();
								setGameState(res);
								setGameLoading(false);
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
						You&apos;re about to reset (remove) all teams from the database. This action is irreversible and should not
						be used unless necessary. Are you sure you want to continue?
					</p>
					{teamState && (teamState.type === 'error' ? ErrorAlert(teamState) : SuccessAlert(teamState))}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={teamLoading}
							onClick={async (e) => {
								e.preventDefault();
								setTeamLoading(true);
								const res = await resetTeams();
								setTeamState(res);
								setTeamLoading(false);
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
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg text-error">WARNING</h3>
					<p className="py-4">
						You&apos;re about to reset (remove) all venues from the database. This action is irreversible and should not
						be used unless necessary. Are you sure you want to continue?
					</p>
					{venueState && (venueState.type === 'error' ? ErrorAlert(venueState) : SuccessAlert(venueState))}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={venueLoading}
							onClick={async (e) => {
								e.preventDefault();
								setVenueLoading(true);
								const res = await resetVenues();
								setVenueState(res);
								setVenueLoading(false);
							}}
						>
							Yes
						</button>
						<form method="dialog">
							<button className="btn" disabled={venueLoading}>
								No
							</button>
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
