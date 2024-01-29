import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getRawTeachers } from '@/libs/tableData';
import { Tables } from './components/Tables';

export default async function Create() {
	const session = await auth();
	if (!isAdmin(session)) return Unauthorized();
	const teachers = await getRawTeachers();

	return (
		<div className="flex flex-col items-center w-full p-6 gap-4">
			<h1 className="text-2xl font-bold text-center">Create Weekly Sport Game</h1>
			<Tables teachers={teachers} />
		</div>
	);
}
