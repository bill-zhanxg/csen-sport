import type { RefObject } from 'react';

export function FileUploader({
	inputRef,
	disabled,
	onChange,
}: {
	inputRef: RefObject<HTMLInputElement | null>;
	disabled: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<input
			ref={inputRef}
			type="file"
			className="file-input file-input-bordered w-full max-w-xl"
			accept=".xlsx"
			onChange={onChange}
			disabled={disabled}
		/>
	);
}
