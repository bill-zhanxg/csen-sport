'use client';

import { useState } from 'react';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';

import { captureFeedback } from '@sentry/nextjs';

import { SuccessAlert } from './Alert';

import type { Session } from 'next-auth';
export function FeedbackButton() {
	return (
		<button
			id="feedback-btn"
			onClick={() => (document.getElementById('feedback-dialog') as HTMLDialogElement).showModal()}
		>
			<HiOutlineChatBubbleBottomCenterText className="h-5 w-5" />
			Submit Feedback
		</button>
	);
}

export function FeedbackDialog({ session }: { session: Session }) {
	const [submitted, setSubmitted] = useState(false);
	const [description, setDescription] = useState('');

	return (
		<dialog
			id="feedback-dialog"
			className="modal"
			onClose={() => {
				setDescription('');
				setSubmitted(false);
			}}
		>
			<div className="modal-box max-w-4xl">
				<h3 className="font-bold text-lg">Report Bugs / Give Feedbacks</h3>
				<p className="py-4">
					Found a bug or have a suggestion? Let me know! (You may need to disable your adblock for this to work)
				</p>
				{submitted ? (
					SuccessAlert({
						message: 'Thank you for your feedback!',
					})
				) : (
					<label className="form-control">
						<div className="label">
							<span className="label-text required-input">Description</span>
						</div>
						<textarea
							className="textarea textarea-bordered w-full"
							placeholder="What's the bug? What did you expect?"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>
				)}
				<div className="modal-action">
					{submitted || (
						<button
							className="btn btn-primary"
							disabled={!description}
							onClick={(e) => {
								e.preventDefault();
								captureFeedback({
									name: session.user.name || 'anonymous',
									email: session.user.email || 'anonymous',
									message: description,
									source: 'feedback-dialog',
									tags: { feedback: 'true' },
									url: window.location.href,
								});

								setSubmitted(true);
							}}
						>
							Submit
						</button>
					)}
					<form method="dialog">
						<button className="btn">Close</button>
					</form>
				</div>
			</div>
		</dialog>
	);
}
