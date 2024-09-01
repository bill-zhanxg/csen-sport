export default function Loading() {
	return (
		<div className="sm:flex flex-col items-center justify-center w-full h-full p-8 pb-2 overflow-auto relative bg-base-200 text-center hidden">
			<div className="flex items-center justify-center w-1/2 h-1/2 skeleton">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		</div>
	);
}
