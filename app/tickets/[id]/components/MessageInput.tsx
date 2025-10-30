'use client';

import type { Dispatch, SetStateAction} from 'react';
import { useCallback, useRef, useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa6';
import { v4 } from 'uuid';

import type { OptimisticMessages } from './MessagesTab';

export function MessageInput({
	sendMessageAction: sendMessage,
	setOptimisticMessagesAction: setOptimisticMessages,
}: {
	sendMessageAction: (message: string) => Promise<void>;
	setOptimisticMessagesAction: Dispatch<SetStateAction<OptimisticMessages>>;
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
			<button className="btn btn-disabled">
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
			<button className="btn btn-primary" disabled={!message.trim()} onClick={send}>
				<FaPaperPlane size={20} />
			</button>
		</div>
	);
}
