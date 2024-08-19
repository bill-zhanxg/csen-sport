import { XataAdapter } from '@auth/xata-adapter';
import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { getXataClient } from './xata';

const xata = getXataClient();

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
	adapter: XataAdapter(xata),
	session: {
		strategy: 'database',
	},
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
			profilePhotoSize: 648,
			allowDangerousEmailAccountLinking: true,
		}),
	],
	callbacks: {
		session({ session, user }) {
			if (user) {
				session.user.id = user.id;
				session.user.role = user.role;
				session.user.team = user.team;
				session.user.guided = user.guided;
				session.user.last_logged_on = user.last_logged_on;
				session.user.reset_only_after_visit_weekly_sport = user.reset_only_after_visit_weekly_sport;
				session.user.timezone = user.timezone;
				session.user.auto_timezone = user.auto_timezone;
			}

			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	debug: process.env.NODE_ENV === 'development',
});
