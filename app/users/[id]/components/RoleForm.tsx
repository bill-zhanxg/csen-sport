'use client';

import { useTransition } from 'react';

interface RoleFormProps {
	currentRole: string | null | undefined;
	updateUserRole: (formData: FormData) => Promise<void>;
}

export function RoleForm({ currentRole, updateUserRole }: RoleFormProps) {
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (formData: FormData) => {
		startTransition(async () => {
			await updateUserRole(formData);
		});
	};

	return (
		<div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
			<form action={handleSubmit} className="space-y-6">
				{/* Role Options Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<label className="group cursor-pointer">
						<input
							type="radio"
							name="role"
							value="student"
							className="sr-only"
							required
							defaultChecked={(currentRole || 'student') === 'student'}
							disabled={isPending}
						/>
						<div className="relative p-4 rounded-lg border-2 border-base-300 bg-base-100 hover:border-success hover:bg-success/10 transition-all duration-200 group-has-[:checked]:border-success group-has-[:checked]:bg-success/20 group-has-[:checked]:shadow-md">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-current group-has-[:checked]:bg-success group-has-[:checked]:border-success relative">
									<div className="absolute inset-1 rounded-full bg-white group-has-[:checked]:bg-success opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
								</div>
								<div>
									<div className="font-medium text-base-content">Student</div>
									<div className="text-xs text-base-content/60">Default role</div>
								</div>
							</div>
						</div>
					</label>

					<label className="group cursor-pointer">
						<input
							type="radio"
							name="role"
							value="teacher"
							className="sr-only"
							defaultChecked={currentRole === 'teacher'}
							disabled={isPending}
						/>
						<div className="relative p-4 rounded-lg border-2 border-base-300 bg-base-100 hover:border-warning hover:bg-warning/10 transition-all duration-200 group-has-[:checked]:border-warning group-has-[:checked]:bg-warning/20 group-has-[:checked]:shadow-md">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-current group-has-[:checked]:bg-warning group-has-[:checked]:border-warning relative">
									<div className="absolute inset-1 rounded-full bg-white group-has-[:checked]:bg-warning opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
								</div>
								<div>
									<div className="font-medium text-base-content">Teacher</div>
									<div className="text-xs text-base-content/60">Can teach</div>
								</div>
							</div>
						</div>
					</label>

					<label className="group cursor-pointer">
						<input
							type="radio"
							name="role"
							value="admin"
							className="sr-only"
							defaultChecked={currentRole === 'admin'}
							disabled={isPending}
						/>
						<div className="relative p-4 rounded-lg border-2 border-base-300 bg-base-100 hover:border-error hover:bg-error/10 transition-all duration-200 group-has-[:checked]:border-error group-has-[:checked]:bg-error/20 group-has-[:checked]:shadow-md">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-current group-has-[:checked]:bg-error group-has-[:checked]:border-error relative">
									<div className="absolute inset-1 rounded-full bg-white group-has-[:checked]:bg-error opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
								</div>
								<div>
									<div className="font-medium text-base-content">Admin</div>
									<div className="text-xs text-base-content/60">Full access</div>
								</div>
							</div>
						</div>
					</label>

					<label className="group cursor-pointer">
						<input
							type="radio"
							name="role"
							value="blocked"
							className="sr-only"
							defaultChecked={currentRole === 'blocked'}
							disabled={isPending}
						/>
						<div className="relative p-4 rounded-lg border-2 border-base-300 bg-base-100 hover:border-error hover:bg-error/10 transition-all duration-200 group-has-[:checked]:border-error group-has-[:checked]:bg-error/20 group-has-[:checked]:shadow-md">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full border-2 border-current group-has-[:checked]:bg-error group-has-[:checked]:border-error relative">
									<div className="absolute inset-1 rounded-full bg-white group-has-[:checked]:bg-error opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
								</div>
								<div>
									<div className="font-medium text-base-content">Blocked</div>
									<div className="text-xs text-base-content/60">No access</div>
								</div>
							</div>
						</div>
					</label>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end pt-4 border-t border-base-300">
					<button className="btn btn-primary px-8" type="submit" disabled={isPending}>
						{isPending ? (
							<>
								<span className="loading loading-spinner loading-sm"></span>
								Updating Role...
							</>
						) : (
							<>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								Update Role
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
