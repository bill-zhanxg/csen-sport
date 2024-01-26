// This file is used only to generate string for copy and should not be imported

import { formatIsJunior } from '@/libs/formatValue';
import { SerializedGame } from '@/libs/serializeData';
import { CSSProperties, ReactNode } from 'react';

const trStyles: CSSProperties = {
	height: '15pt',
};
const evenStyles: CSSProperties = {
	background: '#e8e8e8',
};

export function CopyTable({ games }: { games: SerializedGame[] }) {
	return (
		<table
			border={0}
			cellPadding={10}
			cellSpacing={0}
			style={{
				borderCollapse: 'collapse',
			}}
		>
			<thead>
				<tr style={trStyles}>
					<Th>Date</Th>
					<Th>Group</Th>
					<Th>Team</Th>
					<Th>Opponent</Th>
					<Th>Venue</Th>
					<Th>Teacher</Th>
					<Th>Transportation</Th>
					<Th>Out of Class</Th>
					<Th>Start time</Th>
				</tr>
			</thead>
			<tbody>
				{games.map((game, index) => (
					<tr key={game.id} style={{ ...trStyles, ...(index % 2 === 0 ? evenStyles : {}) }}>
						<Td>{game.date?.toLocaleDateString() || '---'}</Td>
						<Td>{game.team?.isJunior !== undefined ? formatIsJunior(game.team.isJunior) : '---'}</Td>
						<Td>{game.team?.name || '---'}</Td>
						<Td>{game.opponent || '---'}</Td>
						<Td>{game.venue ? `${game.venue.name} (${game.venue.court_field_number})` : '---'}</Td>
						<Td>{game.teacher?.name || '---'}</Td>
						<Td>{game.transportation || '---'}</Td>
						<Td>{game.out_of_class?.toLocaleTimeString() || '---'}</Td>
						<Td>{game.start?.toLocaleTimeString() || '---'}</Td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

const cellStyles: CSSProperties = {
	fontFamily: 'Calibri',
	border: '0.5pt solid windowtext',
	verticalAlign: 'middle',
	padding: '0in 5.4pt 0in 5.4pt',
};
const headerStyles: CSSProperties = {
	fontSize: '11pt',
	fontWeight: '700',
	textAlign: 'center',
};
const tdStyles: CSSProperties = {
	fontSize: '11pt',
	fontWeight: '400',
	textAlign: 'left',
};

function Th({ children }: { children: ReactNode }) {
	return <th style={{ ...cellStyles, ...headerStyles }}>{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
	return (
		<td height={20} style={{ ...cellStyles, ...tdStyles }}>
			{children}
		</td>
	);
}
