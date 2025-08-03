export default function Loading() {
	return (
		<div className="flex flex-col items-center w-full p-6 gap-4">
			<h1 className="text-2xl font-bold text-center">Import Weekly Sport Fixtures</h1>

			{/* Warning messages skeleton */}
			<div className="w-full max-w-2xl h-16 skeleton"></div>
			<div className="w-full max-w-2xl h-16 skeleton"></div>
			<div className="w-full max-w-2xl h-12 skeleton"></div>

			{/* File input skeleton */}
			<div className="w-full max-w-xl h-12 skeleton"></div>

			{/* Import wizard/steps skeleton */}
			<div className="w-full max-w-4xl mt-8">
				{/* Steps indicator */}
				<div className="flex justify-center mb-8">
					<div className="flex gap-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="w-8 h-8 skeleton rounded-full"></div>
						))}
					</div>
				</div>

				{/* Main content area */}
				<div className="bg-base-200 rounded-xl border-2 border-base-200 shadow-lg p-6">
					<div className="w-full h-96 skeleton"></div>
				</div>

				{/* Navigation buttons */}
				<div className="flex justify-between mt-6">
					<div className="w-20 h-10 skeleton"></div>
					<div className="w-20 h-10 skeleton"></div>
				</div>
			</div>
		</div>
	);
}
