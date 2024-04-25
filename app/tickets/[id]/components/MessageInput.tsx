'use client';

import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa6';
import { v4 } from 'uuid';
import { OptimisticMessages } from './MessagesTab';

export function MessageInput({
	sendMessage,
	setOptimisticMessages,
}: {
	sendMessage: (message: string) => Promise<void>;
	setOptimisticMessages: Dispatch<SetStateAction<OptimisticMessages>>;
}) {
	const [message, setMessage] = useState('');
	const textarea = useRef<HTMLTextAreaElement>(null);

	const resizeTextarea = useCallback(() => {
		const target = textarea.current;
		if (!target) return;
		target.style.height = '100%';
		target.style.height = Math.min(target.scrollHeight, 300) + 'px';
	}, []);

	const send = useCallback(async () => {
		const newMessage = message.trim();
		if (!newMessage) return;
		setMessage('');
		setTimeout(() => {
			resizeTextarea();
		}, 0);

		const id = v4();
		setOptimisticMessages((prev) => [...prev, { id, message: newMessage }]);
		await sendMessage(newMessage);
		setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== id));
	}, [message, resizeTextarea, sendMessage, setOptimisticMessages]);

	return (
		<div className="flex gap-2 items-end w-full sticky bottom-0 bg-base-100 p-2 rounded-lg h-16 max-h-96">
			<button className="btn">
				<FaPaperclip size={20} />
			</button>
			<textarea
				placeholder="Type a message..."
				className="textarea resize-none h-full w-full"
				ref={textarea}
				onInput={resizeTextarea}
				value={message}
				onChange={(event) => setMessage(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();
						send();
					}
				}}
				autoFocus
			/>
			<button className="btn btn-primary" disabled={!message} onClick={send}>
				<FaPaperPlane size={20} />
			</button>
		</div>
	);
}
