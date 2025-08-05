import { FaCog, FaUser } from 'react-icons/fa';

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-primary/90 to-primary/80 text-primary-content py-8 px-4 sm:py-12">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{/* Profile Avatar Skeleton */}
						<div className="relative">
							<div className="avatar">
								<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton ring-4 ring-primary-content/20 ring-offset-4 ring-offset-transparent"></div>
							</div>
							<div className="absolute -bottom-2 -right-2 bg-primary-content text-primary p-2 rounded-full">
								<FaUser className="w-3 h-3" />
							</div>
						</div>

						{/* User Info Skeleton */}
						<div className="text-center sm:text-left flex-1 space-y-2">
							<div className="skeleton h-8 w-48 bg-primary-content/20"></div>
							<div className="skeleton h-4 w-64 bg-primary-content/15"></div>
							<div className="flex items-center justify-center sm:justify-start gap-2 text-primary-content/70">
								<FaCog className="w-4 h-4" />
								<span className="text-sm">Account Settings</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto max-w-6xl px-4 py-8 -mt-6 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Sidebar Skeleton */}
					<div className="lg:col-span-3">
						<div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 sticky top-6">
							<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
								<FaCog className="w-5 h-5 text-primary" />
								Quick Settings
							</h3>
							<div className="space-y-3">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="p-3 rounded-lg space-y-2">
										<div className="skeleton h-4 w-24"></div>
										<div className="skeleton h-3 w-32"></div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Main Settings Form Skeleton */}
					<div className="lg:col-span-9">
						<div className="bg-base-100 rounded-2xl shadow-xl border border-base-300">
							{/* Profile Settings Section */}
							<div className="p-6 border-b border-base-300">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
										<div className="w-4 h-4 skeleton"></div>
									</div>
									<div className="skeleton h-6 w-32"></div>
								</div>
								<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
									<div className="lg:col-span-3 space-y-6">
										<div className="space-y-3">
											<div className="skeleton h-4 w-20"></div>
											<div className="skeleton h-12 w-full"></div>
										</div>
										<div className="space-y-3">
											<div className="skeleton h-4 w-24"></div>
											<div className="skeleton h-12 w-full"></div>
										</div>
									</div>
									<div className="lg:col-span-1 flex flex-col items-center">
										<div className="skeleton h-4 w-24 mb-4"></div>
										<div className="skeleton w-20 h-20 rounded-full"></div>
									</div>
								</div>
							</div>

							{/* Other Sections Skeleton */}
							{[...Array(3)].map((_, i) => (
								<div key={i} className="p-6 border-b border-base-300 last:border-b-0">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
											<div className="w-4 h-4 skeleton"></div>
										</div>
										<div className="skeleton h-6 w-40"></div>
									</div>
									<div className="space-y-4">
										<div className="skeleton h-12 w-full"></div>
										<div className="skeleton h-12 w-full"></div>
									</div>
								</div>
							))}

							{/* Submit Button Skeleton */}
							<div className="sticky bottom-0 z-10 p-6 bg-base-200/80 backdrop-blur-sm border-t border-base-300 shadow-lg rounded-b-2xl">
								<div className="flex justify-end">
									<div className="skeleton h-12 w-40"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
