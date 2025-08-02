export default function Loading() {
	return (
		<div className="flex justify-center items-center h-[80vh] w-full">
			<div className="card card-side bg-base-100 shadow-xl w-auto p-0 sm:px-8 sm:py-2 max-w-2xl flex-col">
				<div className="card-body">
					<div className="flex flex-col sm:flex-row gap-6 items-center">
						<div className="avatar">
							<div className="w-24 h-24 rounded-full skeleton"></div>
						</div>
						<div className="flex flex-col gap-2 justify-center flex-1">
							<div className="h-8 bg-gray-200 rounded skeleton w-48"></div>
							<div className="h-5 bg-gray-200 rounded skeleton w-64"></div>
							<div className="h-6 bg-gray-200 rounded skeleton w-20"></div>
						</div>
					</div>
				</div>
				<div className="card-body pt-0">
					<div className="flex flex-col sm:flex-row justify-around gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-full skeleton"></div>
								<div className="h-4 bg-gray-200 rounded skeleton w-20"></div>
							</div>
						))}
					</div>
					<div className="h-12 bg-gray-200 rounded skeleton mt-4"></div>
				</div>
			</div>
		</div>
	);
}
