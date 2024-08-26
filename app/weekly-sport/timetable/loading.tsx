export default function Loading() {
	return (
		<div className="flex flex-col items-center w-full sm:p-4 gap-4">
			<h1 className="text-2xl font-bold text-center">
				Weekly Sport Timetable <span className="inline-block w-64 h-4 skeleton"></span>
			</h1>
			<div className="flex flex-col sm:flex-row gap-4 py-2 px-1 sm:px-4 w-full sm:w-auto">
				<div className="w-full sm:w-64 h-14 skeleton"></div>
			</div>
			<main className="flex flex-col items-center gap-4 pt-0 p-1 sm:p-4 w-full">
				{[...Array(10)].map((_, i) => (
					<div
						className="w-full bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto"
						key={i}
					>
						<div className="w-full mt-2 h-96 skeleton"></div>
					</div>
				))}
			</main>
		</div>
	);
}
