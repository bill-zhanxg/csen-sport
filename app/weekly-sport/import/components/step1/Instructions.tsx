import Link from 'next/link';

export function Instructions() {
	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">
				Before you begin, make sure all teachers are registered and being given the{' '}
				<span className="text-info">teacher</span> role for linking with each game in{' '}
				<Link href="/users" className="link link-primary">
					the User page
				</Link>
			</p>
			<p className="text-xl font-bold text-error text-center max-w-2xl">
				Also make sure you have reset everything in{' '}
				<Link href="/bulk" className="link link-primary">
					the Bulk Action page
				</Link>{' '}
				to prevent any duplicate data
			</p>
			<p className="text-xl font-bold text-center max-w-2xl">
				Please find the latest fixtures Excel from{' '}
				<Link className="link-primary link" href="https://csen.au/semester-sport/" target="_blank">
					CSEN
				</Link>{' '}
				then import it here
			</p>
		</>
	);
}
