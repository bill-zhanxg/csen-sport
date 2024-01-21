import { ImportState } from './ImportPage';

export function Step4({ importState }: { importState: ImportState }) {
	return (
		<div className="w-full max-w-xl">
			{importState.type === 'loading' ? (
				<>
					<h1 className="font-bold">Importing...</h1>
					<progress className="progress w-full"></progress>
				</>
			) : importState.type === 'error' ? (
				<>
					<h1 className="font-bold">Error</h1>
					<p>{importState.message}</p>
					<progress className="progress progress-error w-full" value="100" max="100" ></progress>
					<button className="btn btn-error">Error</button>
				</>
			) : (
				<>
					<h1 className="font-bold">Done</h1>
					<progress className="progress progress-success w-full" value="100" max="100"></progress>
				</>
			)}
		</div>
	);
}
