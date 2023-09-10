import { FaXmark } from 'react-icons/fa6';

export function Error({ message, setMessage }: { message: string; setMessage: (message: string) => void }) {
	return (
		<div className="absolute bottom-3 px-3 w-full">
			<div className="alert alert-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current shrink-0 h-8 w-8"
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
				<span className="text-xl">{message}</span>
				<button className="btn btn-error btn-circle" onClick={() => setMessage('')}>
					<FaXmark className="text-xl" />
				</button>
			</div>
		</div>
	);
}
