export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-8">
					<div className="h-8 skeleton w-48 mx-auto mb-2"></div>
					<div className="h-4 skeleton w-64 mx-auto"></div>
				</div>

				{/* Main Card */}
				<div className="card bg-base-100 shadow-2xl border border-base-300">
					{/* User Info Section */}
					<div className="card-body p-8">
						<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
							{/* Avatar Section */}
							<div className="flex-shrink-0">
								<div className="w-32 h-32 rounded-2xl skeleton"></div>
							</div>

							{/* User Details */}
							<div className="flex-1 text-center lg:text-left space-y-4">
								<div>
									<div className="h-10 skeleton w-64 mx-auto lg:mx-0 mb-2"></div>
									<div className="flex items-center justify-center lg:justify-start gap-2">
										<div className="w-5 h-5 skeleton"></div>
										<div className="h-5 skeleton w-48"></div>
									</div>
								</div>

								{/* Role Badge */}
								<div className="flex justify-center lg:justify-start">
									<div className="h-8 skeleton w-24"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Role Management Section */}
					<div className="border-t border-base-300">
						<div className="p-6 bg-base-50">
							<div className="mb-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-5 h-5 skeleton"></div>
									<div className="h-6 skeleton w-32"></div>
								</div>
								<div className="h-4 skeleton w-80"></div>
							</div>

							{/* Role Form Skeleton */}
							<div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
								<div className="space-y-6">
									{/* Role Options Grid */}
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="p-4 rounded-lg border-2 border-base-300 bg-base-100">
												<div className="flex items-center gap-3">
													<div className="w-4 h-4 rounded-full skeleton"></div>
													<div>
														<div className="h-4 skeleton w-16 mb-1"></div>
														<div className="h-3 skeleton w-20"></div>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Submit Button */}
									<div className="flex justify-end pt-4 border-t border-base-300">
										<div className="h-10 skeleton w-32"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
