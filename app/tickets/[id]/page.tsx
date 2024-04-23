import { MessageInput } from './components/MessageInput';

export default async function TicketMessages({ params }: { params: { id: string } }) {
	return (
		<div className="flex flex-col items-center w-full h-full p-8 pb-2 overflow-auto relative bg-base-200">
			<div className="max-w-[100rem] w-full">
				{[...Array(20)].map((_, i) => (
					<div key={i} className="w-full min-h-24">
						<div className="chat chat-start">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full">
									<img
										alt="Tailwind CSS chat bubble component"
										src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
									/>
								</div>
							</div>
							<div className="chat-header">
								Obi-Wan Kenobi
								<time className="text-xs opacity-50">12:45</time>
							</div>
							<div className="chat-bubble">You were the Chosen One!</div>
							<div className="chat-footer opacity-50">Delivered</div>
						</div>
						<div className="chat chat-end">
							<div className="chat-image avatar">
								<div className="w-10 rounded-full">
									<img
										alt="Tailwind CSS chat bubble component"
										src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
									/>
								</div>
							</div>
							<div className="chat-header">
								Anakin
								<time className="text-xs opacity-50">12:46</time>
							</div>
							<div className="chat-bubble chat-bubble-secondary">I love you!</div>
							<div className="chat-footer opacity-50">Seen</div>
						</div>
					</div>
				))}
			</div>
			<MessageInput />
		</div>
	);
}
