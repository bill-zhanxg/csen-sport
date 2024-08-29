export default function Loading() {
	return (
		<div className="flex items-center justify-center w-full h-full-nav">
			<div className="flex items-center justify-center w-1/2 h-1/2 skeleton">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		</div>
	);
}
