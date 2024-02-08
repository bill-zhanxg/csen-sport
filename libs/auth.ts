import { XataAdapter } from '@auth/xata-adapter';
import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { XataClient } from './xata';

const client = new XataClient();

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
	adapter: XataAdapter(client),
	session: {
		strategy: 'database',
	},
	providers: [
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			tenantId: process.env.AZURE_AD_TENANT_ID,
		}),
	],
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.role = user.role;
				session.user.team = user.team;
				session.user.guided = user.guided;
				session.user.last_logged_on = user.last_logged_on;
				session.user.reset_only_after_visit_weekly_sport = user.reset_only_after_visit_weekly_sport;
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	basePath: '/api/auth',
	debug: process.env.NODE_ENV === 'development',
});
