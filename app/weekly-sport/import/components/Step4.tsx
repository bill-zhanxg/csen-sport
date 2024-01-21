import { ImportState } from './ImportPage';
import { TbReload } from "react-icons/tb";

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
					<h1 className="font-bold">An Error had occurred</h1>
					<p>{importState.message}</p>
					<progress className="progress progress-error w-full" value="56" max="100" ></progress>
					<button className="btn btn-neutral w-full text-center border-1 border-error"><TbReload size={20}/>Retry</button>
				</>
			) : (
				<>
					<h1 className="font-bold">Data Imported</h1>
					<progress className="progress progress-success w-full" value="100" max="100" ></progress>
				</>
			)}
		</div>
	);
}
