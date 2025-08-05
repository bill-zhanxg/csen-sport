export default function Loading() {
	return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-[50rem] m-4 flex gap-8 flex-col">
				{/* Header Skeleton */}
				<div className="bg-gradient-to-r from-primary/90 to-primary/80 text-primary-content p-6 rounded-t-2xl">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-primary-content/20 rounded-lg skeleton"></div>
						<div className="h-6 w-40 bg-primary-content/20 rounded skeleton"></div>
					</div>
					<div className="h-4 w-64 bg-primary-content/20 rounded skeleton mt-2"></div>
				</div>

				{/* Content Skeleton */}
				<div className="bg-base-100 rounded-b-2xl shadow-xl border border-base-300">
						<div className="p-6 space-y-8">
							{/* Basic Information Section */}
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-4 h-4 bg-primary/20 rounded skeleton"></div>
									<div className="h-5 w-32 bg-base-300 rounded skeleton"></div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="h-4 w-16 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-12 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-20 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-24 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
								</div>
							</div>

							{/* Location & Staff Section */}
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-4 h-4 bg-secondary/20 rounded skeleton"></div>
									<div className="h-5 w-36 bg-base-300 rounded skeleton"></div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="h-4 w-16 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-28 bg-base-300 rounded skeleton"></div>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-base-300 rounded-lg skeleton"></div>
											<div className="h-6 w-32 bg-base-300 rounded skeleton"></div>
										</div>
									</div>
									<div className="space-y-2 md:col-span-2">
										<div className="h-4 w-36 bg-base-300 rounded skeleton"></div>
										<div className="flex flex-wrap gap-2">
											<div className="flex items-center gap-3 bg-base-200 rounded-lg px-3 py-2">
												<div className="w-8 h-8 bg-base-300 rounded-lg skeleton"></div>
												<div className="h-5 w-24 bg-base-300 rounded skeleton"></div>
											</div>
											<div className="flex items-center gap-3 bg-base-200 rounded-lg px-3 py-2">
												<div className="w-8 h-8 bg-base-300 rounded-lg skeleton"></div>
												<div className="h-5 w-28 bg-base-300 rounded skeleton"></div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Schedule & Transportation Section */}
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-4 h-4 bg-accent/20 rounded skeleton"></div>
									<div className="h-5 w-44 bg-base-300 rounded skeleton"></div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="space-y-2">
										<div className="h-4 w-24 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-20 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
									<div className="space-y-2">
										<div className="h-4 w-28 bg-base-300 rounded skeleton"></div>
										<div className="h-6 w-full bg-base-300 rounded skeleton"></div>
									</div>
								</div>
							</div>

							{/* Game Status Section */}
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-4 h-4 bg-success/20 rounded skeleton"></div>
									<div className="h-5 w-24 bg-base-300 rounded skeleton"></div>
								</div>
								<div className="flex items-center gap-3">
									<div className="h-6 w-32 bg-base-300 rounded-full skeleton"></div>
								</div>
							</div>

							{/* Optional Form Elements (for teacher view) */}
							<div className="space-y-4">
								<div className="h-20 w-full bg-base-300 rounded skeleton"></div>
								<div className="h-16 w-full bg-base-300 rounded skeleton"></div>
							</div>
						</div>

				{/* Potential Sticky Button Area */}
				<div className="bg-base-100/80 backdrop-blur-sm border-t border-base-300 p-6 rounded-b-2xl">
					<div className="flex justify-end">
						<div className="h-12 w-48 bg-primary/20 rounded skeleton"></div>
					</div>
				</div>
			</div>
		</div>
		</div>
	);
}