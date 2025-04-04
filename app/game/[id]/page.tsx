import { authC } from '@/app/cache';
import { ErrorMessage } from '@/app/globalComponents/ErrorMessage';
import { isTeacher } from '@/libs/checkPermission';
import { serializeGame } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import { GameForm } from './components/GameForm';

export const metadata: Metadata = {
	title: 'Game',
};

export default async function EditGame(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await authC();
    const game = await getXataClient().db.games.read(params.id, ['*', 'team.*', 'venue.*', 'teacher.*']);
    const isTeacherBool = isTeacher(session);

    const teams = isTeacherBool ? await getRawTeams() : [];
    const venues = isTeacherBool ? await getRawVenues() : [];
    const teachers = await getRawTeachers();

    if (!game) return <ErrorMessage code="404" message="Game not found" />;

    return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-[50rem] m-4 flex gap-8 flex-col">
				<GameForm
					session={session}
					game={serializeGame(game, isTeacherBool)}
					teams={teams}
					venues={venues}
					teachers={teachers}
				/>
			</div>
		</div>
	);
}
