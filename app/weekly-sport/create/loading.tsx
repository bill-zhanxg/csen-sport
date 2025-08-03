export default function Loading() {
	return (
		<div className="flex flex-col items-center w-full p-6 gap-4">
			<h1 className="text-2xl font-bold text-center">Create Weekly Sport Game</h1>

			{/* Tables loading skeleton */}
			<div className="w-full max-w-6xl">
				{/* Game creation form skeleton */}
				<div className="bg-base-200 rounded-xl border-2 border-base-200 shadow-lg p-6 mb-6">
					<div className="w-48 h-6 skeleton mb-4"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="flex flex-col gap-2">
								<div className="w-24 h-4 skeleton"></div>
								<div className="w-full h-10 skeleton"></div>
							</div>
						))}
					</div>
					<div className="mt-4 w-32 h-10 skeleton"></div>
				</div>

				{/* Games table skeleton */}
				<div className="bg-base-200 rounded-xl border-2 border-base-200 shadow-lg p-6">
					<div className="w-32 h-6 skeleton mb-4"></div>
					<div className="overflow-x-auto">
						<div className="w-full">
							{/* Table header */}
							<div className="flex gap-4 mb-2 pb-2 border-b border-base-300">
								{[...Array(8)].map((_, i) => (
									<div key={i} className="w-24 h-4 skeleton"></div>
								))}
							</div>
							{/* Table rows */}
							{[...Array(10)].map((_, i) => (
								<div key={i} className="flex gap-4 mb-2 py-2">
									{[...Array(8)].map((_, j) => (
										<div key={j} className="w-24 h-8 skeleton"></div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
