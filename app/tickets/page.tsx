import Icon from '@/app/images/icon.png';
import Image from 'next/image';

export default async function Tickets() {
	return (
		<div className="sm:flex flex-col items-center justify-center w-full h-full p-8 pb-2 overflow-auto relative bg-base-200 text-center hidden">
			<div className="flex items-center gap-2">
				<Image src={Icon} alt="Logo" width={50} height={50} />
				<h1 className="font-bold text-3xl">CSEN Sport Ticket System</h1>
			</div>
			<p className='max-w-lg'>
				Create or select a ticket to get started, these requests might be for troubleshooting issues, getting help with
				a service, or asking any questions you might have
			</p>
		</div>
	);
}
