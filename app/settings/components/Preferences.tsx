'use client';

import { useEffect, useState } from 'react';

export function Preferences({
	teams,
}: {
	teams: {
		id: string;
		name?: string | null;
		isJunior?: boolean | null;
	}[];
}) {
	const [group, setGroup] = useState<'default' | 'junior' | 'intermediate'>('default');
	const [filteredTeams, setFilteredTeams] = useState([teams[0]]);

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
			<label className="form-control w-full text-">
				<div className="label">
					<span className="label-text">Pick Your Group</span>
				</div>
				<select
					className="select select-bordered"
					value={group}
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
				<select disabled={group === 'default'} className="select select-bordered" name="team">
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
