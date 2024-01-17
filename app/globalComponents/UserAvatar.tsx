import Image from 'next/image';

export function UserAvatar({
	user,
	className = '',
}: {
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	className?: string;
}) {
	return user.image ? (
		<Image src={user.image} alt="User Avatar" height={100} width={100} className={`w-12 h-12 ${className}`} />
	) : (
		<Image
			src={`https://icotar.com/${user.name ? 'initials' : 'avatar'}/${encodeURI(
				user.name ?? (user.email || user.id),
			)}.png`}
			width={100}
			height={100}
			alt="User Avatar"
			className={`w-12 h-12 ${className}`}
		/>
	);
}
