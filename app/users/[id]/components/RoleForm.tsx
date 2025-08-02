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
		<form action={handleSubmit} className="card-body pt-0">
			<div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-around">
				<label className="flex flex-row sm:flex-row-reverse label cursor-pointer gap-2">
					<input
						type="radio"
						name="role"
						value="student"
						className="radio radio-success"
						required
						defaultChecked={(currentRole || 'student') === 'student'}
						disabled={isPending}
					/>
					<span className="label-text">Student (Default)</span>
				</label>
				<label className="flex flex-row sm:flex-row-reverse label cursor-pointer gap-2">
					<input
						type="radio"
						name="role"
						value="teacher"
						className="radio radio-warning"
						defaultChecked={currentRole === 'teacher'}
						disabled={isPending}
					/>
					<span className="label-text">Teacher</span>
				</label>
				<label className="flex flex-row sm:flex-row-reverse label cursor-pointer gap-2">
					<input
						type="radio"
						name="role"
						value="admin"
						className="radio radio-error"
						defaultChecked={currentRole === 'admin'}
						disabled={isPending}
					/>
					<span className="label-text">Administrator</span>
				</label>
				<label className="flex flex-row sm:flex-row-reverse label cursor-pointer gap-2">
					<input
						type="radio"
						name="role"
						value="blocked"
						className="radio radio-error"
						defaultChecked={currentRole === 'blocked'}
						disabled={isPending}
					/>
					<span className="label-text">Blocked</span>
				</label>
			</div>
			<button className="btn btn-info" type="submit" disabled={isPending}>
				{isPending ? 'Updating...' : 'Change Role'}
			</button>
		</form>
	);
}
