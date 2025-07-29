import { TbReload } from 'react-icons/tb';
import { ImportState } from './ImportPage';

export function Step3({ importState, retry }: { importState: ImportState; retry: () => void }) {
	return (
		<div className="w-full max-w-xl">
			{importState.type === 'loading' ? (
				<>
					<h1 className="font-bold">Importing...</h1>
					<progress className="progress w-full"></progress>
				</>
			) : importState.type === 'error' ? (
				<>
					<div className="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-8 w-8"
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
						<span className="text-xl font-bold">An error had occurred X_X</span>
					</div>
					<div className="flex w-full justify-center pt-2">
						<code className="italic text-error text-center">{importState.message}</code>
					</div>
					<progress className="progress progress-error w-full" value="56" max="100"></progress>
					<button onClick={retry} className="btn btn-neutral w-full text-center">
						<TbReload size={20} />
						Retry
					</button>
				</>
			) : (
				<>
					<h1 className="font-bold">Data Imported</h1>
					<progress className="progress progress-success w-full" value="100" max="100"></progress>
				</>
			)}
		</div>
	);
}
