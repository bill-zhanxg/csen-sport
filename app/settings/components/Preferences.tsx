'use client';

import { isTeacher } from '@/libs/checkPermission';
import { SerializedTeam } from '@/libs/serializeData';
import { Session } from 'next-auth/types';
import { useEffect, useState } from 'react';

export function Preferences({ teams, session }: { teams: SerializedTeam[]; session: Session }) {
	const currentTeam = teams.find((team) => team.id === session.user.team?.id);

	const [group, setGroup] = useState<'default' | 'junior' | 'intermediate'>(
		currentTeam === undefined ? 'default' : currentTeam.isJunior ? 'junior' : 'intermediate',
	);
	const [filteredTeams, setFilteredTeams] = useState<SerializedTeam[]>(teams);

	useEffect(() => {
		setFilteredTeams(
			teams.filter((team) => {
				if (group === 'junior') return team.isJunior;
				if (group === 'intermediate') return !team.isJunior;
				return false;
			}),
		);
	}, [group, teams]);

	return (
		<div className="flex justify-center flex-col w-full">
			<label className="form-control w-full">
				{isTeacher(session) && (
					<p className='text-xl font-bold text-primary'>You are a teacher, games shown in home page will be already filtered to the games you are in charge</p>
				)}
				<div className="label">
					<span className="label-text">Pick Your Group</span>
				</div>
				<select
					className="select select-bordered"
					value={group}
					disabled={isTeacher(session)}
					onChange={(e) => {
						setGroup(e.target.value as 'default' | 'junior' | 'intermediate');
					}}
				>
					<option value="default">Default (Both)</option>
					<option value="junior">Junior</option>
					<option value="intermediate">Intermediate</option>
				</select>
				<div className="label">
					<span className="label-text">Pick Your Team</span>
				</div>
				<select
					disabled={group === 'default' || isTeacher(session)}
					defaultValue={currentTeam?.id}
					className="select select-bordered"
					name="team"
				>
					<option disabled>Pick one</option>
					{filteredTeams.map((team) => (
						<option key={team.id} value={team.id} className="text-base-content">
							{team.name}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
