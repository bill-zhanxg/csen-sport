export default function Loading() {
	return (
		<div className="flex flex-col items-center w-full py-6 px-4 sm:px-6 gap-6">
			<div className="text-center max-w-4xl">
				<h1 className="text-3xl sm:text-4xl font-bold mb-4">
					Hello <span className="inline-block w-32 h-8 skeleton rounded"></span>
				</h1>
				<div className="w-80 h-6 skeleton rounded mx-auto"></div>
			</div>
			<main className="flex flex-col items-center w-full max-w-7xl">
				{[...Array(3)].map((_, dateIndex) => (
					<div key={dateIndex} className="w-full">
						<div className="w-full max-w-7xl">
							{/* Date Header Skeleton */}
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 bg-base-300 rounded-lg skeleton"></div>
								<div>
									<div className="w-48 h-8 skeleton rounded mb-2"></div>
									<div className="w-24 h-4 skeleton rounded"></div>
								</div>
							</div>

							{/* Games Grid Skeleton */}
							<div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
								{[...Array(2)].map((_, gameIndex) => (
									<div key={gameIndex} className="card w-full bg-base-100 shadow-lg border-2 border-base-300">
										<div className="card-body p-3 sm:p-4">
											{/* Header skeleton */}
											<div className="flex flex-col gap-2 mb-3">
												<div className="flex items-center gap-3">
													<div className="min-w-0 flex-1">
														<div className="w-40 h-6 skeleton rounded mb-2"></div>
														<div className="flex gap-2">
															<div className="w-16 h-5 skeleton rounded"></div>
															<div className="w-16 h-5 skeleton rounded"></div>
														</div>
													</div>
												</div>

												{/* Action buttons skeleton */}
												<div className="flex gap-2 justify-end">
													<div className="w-6 h-6 skeleton rounded"></div>
													<div className="w-20 h-8 skeleton rounded"></div>
												</div>
											</div>

											{/* Details grid skeleton */}
											<div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 sm:gap-3">
												{[...Array(6)].map((_, detailIndex) => (
													<div key={detailIndex} className="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
														<div className="w-4 h-4 bg-base-300 rounded skeleton flex-shrink-0"></div>
														<div className="flex-1">
															<div className="w-12 h-3 skeleton rounded mb-1"></div>
															<div className="w-20 h-3 skeleton rounded"></div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						{dateIndex < 2 && <div className="divider my-8"></div>}
					</div>
				))}
			</main>
		</div>
	);
}
