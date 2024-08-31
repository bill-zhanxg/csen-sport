import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { write } from 'xlsx';
import { getTeamsWorkbook } from '../dl';

export async function GET() {
	const session = await authC();
	if (!isAdmin(session)) return new Response('Unauthorized', { status: 401 });

	try {
		const workbook = await getTeamsWorkbook();
		const buffer = write(workbook, { type: 'buffer' });

		return new Response(buffer, {
			headers: {
				'content-disposition': `attachment; filename="Teams.xlsx"`,
			},
		});
	} catch (e) {
		return new Response('Error: ' + (e as Error).message, { status: 500 });
	}
}
