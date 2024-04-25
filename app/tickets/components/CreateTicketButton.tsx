'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { createTicket } from './actions';

export function CreateTicketButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-2">
			<AnimatePresence>
				<button className={`btn w-full ${isOpen ? 'btn-disabled' : 'btn-primary'}`} onClick={() => setIsOpen(true)}>
					New Ticket
				</button>
				{isOpen && (
					<motion.form
						className="bg-base-200 rounded-lg border-2"
						key="create-ticket-popup"
						initial={{ opacity: 0, height: 0, marginTop: 0, padding: 0 }}
						animate={{ opacity: 1, height: 'auto', marginTop: 8, padding: 8 }}
						exit={{ opacity: 0, height: 0, marginTop: 0, padding: 0 }}
						transition={{ duration: 0.2 }}
						action={createTicket}
						onSubmit={() => {
							setIsOpen(false);
						}}
					>
						<h2 className="text-center font-bold">New Ticket</h2>
						<label className="form-control w-full">
							<span className="label-text">Ticket Title</span>
							<input
								name="title"
								type="text"
								placeholder="Type here"
								className="input input-bordered input-sm w-full"
								required
							/>
						</label>
						<button className="btn btn-primary btn-sm w-full mt-3" type="submit">
							Create Ticket
						</button>
					</motion.form>
				)}
			</AnimatePresence>
		</div>
	);
}
