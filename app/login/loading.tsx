export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
			{/* Animated background placeholder */}
			<div className="absolute inset-0 opacity-30">
				<div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5"></div>
			</div>

			<div className="w-full max-w-md relative z-10">
				{/* Main Card */}
				<div className="card bg-base-100 shadow-2xl border border-base-300">
					<div className="card-body p-8">
						{/* Header Section */}
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h1>
							<p className="text-base-content/70 text-sm">Sign in to access CSEN Sport</p>
						</div>

						{/* Login Button Skeleton */}
						<div className="mb-6">
							<div className="w-full h-12 skeleton"></div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-base-content/60">Made with ❤️ by Bill Zhang</p>
				</div>
			</div>
		</div>
	);
}
