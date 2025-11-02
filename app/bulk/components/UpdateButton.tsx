import { memo } from 'react';

interface UpdateButtonProps {
	changed: boolean;
	loading: boolean;
	onUpdate: () => void;
}

export const UpdateButton = memo(function UpdateButton({ changed, loading, onUpdate }: UpdateButtonProps) {
	return (
		<div className="sticky left-0 bottom-0 bg-base-100 py-2 z-10 border-t border-base-300">
			<button className="btn btn-primary w-full" disabled={!changed || loading} onClick={onUpdate}>
				{loading ? (
					<>
						<span className="loading loading-spinner loading-sm"></span>
						Updating...
					</>
				) : (
					'Update Games'
				)}
			</button>
		</div>
	);
});
