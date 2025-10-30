import type { RawTeacher } from '@/libs/tableData';
import { FaUsers } from 'react-icons/fa6';
import { MultiSelect } from 'react-multi-select-component';

export function TeachersMultiSelect({
	teachers,
	value,
	onChange,
	disabled,
	actualDisabled = false,
	className = '',
}: {
	teachers: RawTeacher[];
	value?: string[];
	onChange?: (e: {
		target: {
			value: string[];
		};
	}) => void;
	disabled?: boolean;
	actualDisabled?: boolean;
	className?: string;
}) {
	return (
		<MultiSelect
			className={`w-full [&>div>.dropdown-heading]:cursor-pointer text-sm text-base-content ${className}`}
			options={teachers.map(({ id, name }) => ({ value: id, label: name ?? '', disabled: actualDisabled }))}
			value={
				value?.map((id) => ({ value: id, label: teachers.find((teacher) => teacher.id === id)?.name ?? '' })) ?? []
			}
			onChange={(value: any[]) => {
				if (onChange) onChange({ target: { value: value.map((teacher) => teacher.value) } });
			}}
			isLoading={disabled}
			valueRenderer={(selected) => {
				return selected.length ? (
					<div className="flex items-center gap-2">
						<FaUsers />
						{selected.length === 1 ? selected[0].label : `${selected.length} Teachers Selected`}
					</div>
				) : (
					<div className="flex items-center gap-2">
						<FaUsers />
						Select Teachers
					</div>
				);
			}}
			labelledBy="Select Teachers"
		/>
	);
}
