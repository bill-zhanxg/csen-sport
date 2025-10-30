'use client';

import { useEffect, useState } from 'react';

import { isTeacher } from '@/libs/checkPermission';

import type { SerializedTeam } from '@/libs/serializeData';
import type { Session } from 'next-auth';
export function Preferences({ teams, session }: { teams: SerializedTeam[]; session: Session }) {
	const currentTeam = teams.find((team) => team.id === session.user.team?.id);

	const [group, setGroup] = useState<'default' | 'junior' | 'intermediate'>(
		currentTeam === undefined ? 'default' : currentTeam.isJunior ? 'junior' : 'intermediate',
	);
	const [filteredTeams, setFilteredTeams] = useState<SerializedTeam[]>(teams);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFilteredTeams(
			teams.filter((team) => {
				if (group === 'junior') return team.isJunior;
				if (group === 'intermediate') return !team.isJunior;
				return false;
			}),
		);
	}, [group, teams]);

	return (
		<div className="space-y-2 w-full">
			{isTeacher(session) && (
				<div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
					<p className="text-primary font-medium">
						<span className="font-bold">Teacher Account:</span> Games shown on the home page will be automatically
						filtered to show only the games you are in charge of.
					</p>
				</div>
			)}

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Group Preference</legend>
				<select
					className="select focus:select-primary transition-colors w-full"
					value={group}
					disabled={isTeacher(session)}
					onChange={(e) => {
						setGroup(e.target.value as 'default' | 'junior' | 'intermediate');
					}}
				>
					<option value="default">Default (Both Groups)</option>
					<option value="junior">Junior (Year 7 - 8)</option>
					<option value="intermediate">Intermediate (Year 9 - 10)</option>
				</select>
				<span className="label text-base-content/70">Choose which age group games you want to see by default</span>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Team Preference</legend>
				<select
					disabled={group === 'default' || isTeacher(session)}
					defaultValue={currentTeam?.id || 'Pick one'}
					className="select focus:select-primary transition-colors w-full"
					name="team"
				>
					<option disabled>Pick one</option>
					{filteredTeams.map((team) => (
						<option key={team.id} value={team.id} className="text-base-content">
							{team.name}
						</option>
					))}
				</select>
				<span className="label text-base-content/70">
					{group === 'default'
						? 'Select a group first to choose a specific team'
						: isTeacher(session)
						? 'Team selection is managed automatically for teachers'
						: 'Choose your preferred team to highlight their games'}
				</span>
			</fieldset>
		</div>
	);
}
