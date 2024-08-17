import { Role } from '@/next-auth';
import { XataAdapter } from '@auth/xata-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { getXataClient } from './xata';

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
	adapter: XataAdapter(getXataClient()),
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
		Credentials({
			id: 'password',
			name: 'Password',
			credentials: {
				password: { label: 'Password', type: 'password' },
			},
			authorize: (credentials) => {
				console.log('auth has been called');
				const getUser = (role: Role) => ({
					id: 'test_user',
					name: 'Test User',
					email: 'test_user@test.com',
					image:
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
					role,
					team: undefined,
					guided: undefined,
					last_logged_on: undefined,
					reset_only_after_visit_weekly_sport: undefined,
					timezone: undefined,
					auto_timezone: undefined,
				});

				switch (credentials.password) {
					case process.env.TEST_LOGIN_ADMIN_PASSWORD:
						return getUser('admin');
					case process.env.TEST_LOGIN_DEVELOPER_PASSWORD:
						return getUser('developer');
					case process.env.TEST_LOGIN_TEACHER_PASSWORD:
						return getUser('teacher');
					case process.env.TEST_LOGIN_STUDENT_PASSWORD:
						return getUser('student');
					case process.env.TEST_LOGIN_BLOCKED_PASSWORD:
						return getUser('blocked');
				}
				return null;
			},
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
