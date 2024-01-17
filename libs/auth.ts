import { XataAdapter } from '@auth/xata-adapter';
import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { XataClient } from './xata';

const client = new XataClient();

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
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
				session.user.role = user.role;
				session.user.id = user.id;
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	debug: process.env.NODE_ENV === 'development',
});
