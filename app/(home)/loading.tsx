export default function Loading() {
	return (
		<div className="flex flex-col items-center w-full py-6 p-1 sm:p-4 gap-4">
			<h1 className="text-2xl font-bold text-center">
				Hello <span className="inline-block w-32 h-4 skeleton"></span>
			</h1>
			<h2 className="text-xl text-center max-w-3xl">
				<div className="w-64 h-4 skeleton"></div>
			</h2>
			<main className="flex flex-col items-center gap-4 pt-0 p-1 sm:p-4 w-full">
				{[...Array(5)].map((_, i) => (
					<div
						className="w-full bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto"
						key={i}
					>
						<div className="w-full mt-2 h-32 skeleton"></div>
					</div>
				))}
			</main>
		</div>
	);
}
