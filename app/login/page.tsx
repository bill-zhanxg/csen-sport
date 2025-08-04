import { signIn } from '@/libs/auth';
import { Metadata } from 'next';
import { LoginBtn } from './components/LoginBtn';
import { ParticleBackground } from './components/ParticleBackground';

export const metadata: Metadata = {
	title: 'Login',
};

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

export default async function Login(props: {
	searchParams: Promise<{
		error: ErrorCodes | string | string[] | undefined;
		message: string | string[] | undefined;
	}>;
}) {
	const searchParams = await props.searchParams;

	async function login() {
		'use server';
		await signIn('microsoft-entra-id');
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
			{/* Animated particle background */}
			<ParticleBackground />

			<div className="w-full max-w-md relative z-10">
				{/* Main Card */}
				<div className="card bg-base-100 shadow-2xl border border-base-300">
					<div className="card-body p-8">
						{/* Header Section */}
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h1>
							<p className="text-base-content/70 text-sm">Sign in to access CSEN Sport</p>
						</div>

						{/* Login Button */}
						<div className="mb-6">
							<LoginBtn loginAction={login} />
						</div>

						{/* Error Message */}
						{(searchParams.message || searchParams.error) && (
							<div className="alert alert-error shadow-lg">
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
								<div>
									<h3 className="font-semibold">Authentication Error</h3>
									<div className="text-xs opacity-80">{searchParams.message || getMessages(searchParams.error)}</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-base-content/60">Made with ❤️ by Bill Zhang</p>
				</div>
			</div>
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
