import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { write } from 'xlsx';
import { getGamesWorkbook } from '../dl';

export async function GET() {
	const session = await authC();
	if (!isAdmin(session)) return new Response('Unauthorized', { status: 401 });

	try {
		const workbook = await getGamesWorkbook();
		const buffer = write(workbook, { type: 'buffer' });

		return new Response(buffer, {
			headers: {
				'content-disposition': `attachment; filename="Fixtures.xlsx"`,
			},
		});
	} catch (e) {
		return new Response('Error: ' + (e as Error).message, { status: 500 });
	}
}
