import { auth, signIn } from '@/libs/auth';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Pw } from './Pw';

export const metadata: Metadata = {
	title: 'Login',
};

const LoginBtn = dynamic(() => import('./components/LoginBtn'), {
	ssr: false,
	loading: () => <div className="btn w-4/5 max-w-[20rem] skeleton">Loading...</div>,
});

type ErrorCodes =
	| 'OAuthSignin'
	| 'OAuthCallback'
	| 'OAuthCreateAccount'
	| 'EmailCreateAccount'
	| 'Callback'
	| 'OAuthAccountNotLinked'
	| 'EmailSignin'
	| 'CredentialsSignin'
	| 'SessionRequired'
	| 'Default';

export default async function Login({
	searchParams,
}: {
	searchParams: {
		redirect: string | string[] | undefined;
		error: ErrorCodes | string | string[] | undefined;
		message: string | string[] | undefined;
	};
}) {
	const callbackURL = typeof searchParams.redirect === 'string' ? searchParams.redirect : searchParams.redirect?.[0];

	const session = await auth();
	if (session) return redirect(decodeURIComponent(callbackURL ?? '/'));

	async function login() {
		'use server';
		await signIn('microsoft-entra-id');
	}

	return (
		<div className="flex flex-col justify-center items-center gap-3 h-full">
			<h1 className="text-4xl text-center font-bold p-5">CSEN Sport Login</h1>
			<LoginBtn login={login} />
			<form
				action={async () => {
					'use server';
					const csrfToken = cookies().get('authjs.csrf-token')?.value?.split('|').at(0);
					console.log(csrfToken);
					const url = await signIn('credentials', {
						csrfToken,
						password: 'E[QH=uz7mqDG%;9:6M"wUfXRh>Bc`A2g,Pt/8xK]@WLFkj_s*v',
						// redirect: false,
					});
					console.log(url);
					// redirect(url);
				}}
			>
				<Pw />
			</form>
			{/* Error */}
			{(searchParams.message || searchParams.error) && (
				<div className="alert alert-error w-4/5 max-w-[20rem]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>Error: {searchParams.message || getMessages(searchParams.error)}</span>
				</div>
			)}
		</div>
	);
}

function getMessages(error: ErrorCodes | string | string[] | undefined) {
	switch (error) {
		case 'OAuthSignin':
			return 'Error in constructing an authorization URL.';
		case 'OAuthCallback':
			return 'Error in handling the response from an OAuth provider.';
		case 'OAuthCreateAccount':
			return 'Could not create OAuth provider user in the database.';
		case 'EmailCreateAccount':
			return 'Could not create email provider user in the database.';
		case 'Callback':
			return 'Error in the OAuth callback handler route.';
		case 'OAuthAccountNotLinked':
			return 'The email on the account is already linked, but not with this OAuth account.';
		case 'EmailSignin':
			return 'Sending the e-mail with the verification token failed.';
		case 'CredentialsSignin':
			return 'The authorize callback returned null in the Credentials provider.';
		case 'SessionRequired':
			return 'The content of this page requires you to be signed in at all times.';
		default:
			return 'Unexpected error.';
	}
}
