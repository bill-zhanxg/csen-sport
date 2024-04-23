'use client';

import { FaPaperPlane, FaPaperclip } from 'react-icons/fa6';

export function MessageInput() {
	return (
		<div className="flex gap-2 items-end w-full sticky bottom-0 bg-base-100 p-2 rounded-lg h-16 max-h-96">
			<button className="btn">
				<FaPaperclip size={20} />
			</button>
			<textarea
				placeholder="Type a message..."
				className="textarea resize-none h-full w-full"
				onInput={(event) => {
					const target = event.currentTarget;
					target.style.height = '100%';
					target.style.height = Math.min(target.scrollHeight, 300) + 'px';
				}}
			/>
			<button className="btn btn-primary">
				<FaPaperPlane size={20} />
			</button>
		</div>
	);
}
