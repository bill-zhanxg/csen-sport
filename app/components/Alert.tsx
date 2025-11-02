import { toast, type ExternalToast } from 'sonner';

// Toast-friendly type that can be spread directly into toast functions
export type ToastMessage = {
	message: string;
	type: 'success' | 'error';
	options?: ExternalToast;
} | null;

// Helper function to show toast from ToastMessage
export function showToast(toastMessage: ToastMessage) {
	if (!toastMessage) return;
	const { type, message, options } = toastMessage;
	toast[type](message, options);
}

export function ErrorAlert({ message }: { message: string }) {
	return (
		<div role="alert" className="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{message}</span>
		</div>
	);
}

export function SuccessAlert({ message }: { message: string }) {
	return (
		<div role="alert" className="alert alert-success">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{message}</span>
		</div>
	);
}
