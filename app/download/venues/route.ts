import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { write } from 'xlsx';
import { getVenuesWorkbook } from '../dl';

export async function GET() {
	const session = await auth();
	if (!isAdmin(session)) return new Response('Unauthorized', { status: 401 });

	try {
		const workbook = await getVenuesWorkbook();
		const buffer = write(workbook, { type: 'buffer' });

		return new Response(buffer, {
			headers: {
				'content-disposition': `attachment; filename="Venues.xlsx"`,
			},
		});
	} catch (e) {
		return new Response('Error: ' + (e as Error).message, { status: 500 });
	}
}
