import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { Dispatch, SetStateAction, useTransition } from 'react';
import { Defaults } from '../types';

export function DefaultSection({
	defaults,
	setDefaults,
	teachers,
}: {
	defaults: Defaults;
	setDefaults: Dispatch<SetStateAction<Defaults>>;
	teachers: { id: string; name?: string | null }[];
}) {
	const [teacherPending, teacherTransition] = useTransition();

	return (
		<div className="flex justify-center w-full">
			<div className="flex flex-col items-center gap-2 rounded-xl border-2 border-primary shadow-lg shadow-border-primary p-4 w-[98%]">
				<h1 className="font-bold">Default Section</h1>
				<p>Experiment feature, does not work</p>
				<div className="flex flex-col xl:flex-row gap-4 w-full">
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Default Teacher for all Teams</span>
						</div>
						<select
							className="select select-bordered w-full"
							value={defaults.default_teacher ?? ''}
							onChange={(event) =>
								teacherTransition(() => {
									setDefaults((defaults) => ({ ...defaults, default_teacher: event.target.value || undefined }));
								})
							}
						>
							<option value="">Select a teacher</option>
							{teachers.map((teacher) => (
								<option key={teacher.id} value={teacher.id}>
									{teacher.name}
								</option>
							))}
						</select>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Default Extra Teacher for all Teams</span>
						</div>
						<TeachersMultiSelect
							teachers={teachers}
							value={defaults.default_extra_teachers ?? []}
							onChange={(e) => {
								setDefaults((defaults) => ({ ...defaults, default_extra_teachers: e as any }));
							}}
							className="[&>div]:!rounded-lg"
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Default Out of Class time for all Teams</span>
						</div>
						<input
							type="time"
							className="bg-base-100 border border-base-300 rounded-lg h-12 px-4 w-full"
							value={defaults.default_out_of_class ?? ''}
							onChange={(event) =>
								setDefaults((defaults) => ({ ...defaults, default_out_of_class: event.target.value || undefined }))
							}
						/>
					</label>
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Default Start time for all Teams</span>
						</div>
						<input
							type="time"
							className="bg-base-100 border border-base-300 rounded-lg h-12 px-4 w-full"
							value={defaults.default_start ?? ''}
							onChange={(event) =>
								setDefaults((defaults) => ({ ...defaults, default_start: event.target.value || undefined }))
							}
						/>
					</label>
				</div>
			</div>
		</div>
	);
}
