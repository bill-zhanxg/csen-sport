'use client';

import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { useState } from 'react';

export function ProfilePicture({
	user,
}: {
	user: {
		id: string;
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
	};
}) {
	const [userState, setUser] = useState(user);

	return (
		<label
			htmlFor="avatar"
			className="avatar hover:cursor-pointer w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden mt-2 backdrop-opacity-10 bg-white/30"
		>
			<UserAvatar user={userState} />
			<input
				type="file"
				id="avatar"
				name="avatar"
				accept="image/*"
				className="hidden"
				onChange={async (event) => {
					const file = event.target.files?.[0];
					if (!file) return;

                    // Encoded image must be below 256 characters
                    const buffer = await file.arrayBuffer();

					setUser((user) => {
						return {
							...user,
						};
					});
				}}
			/>
		</label>
	);
}
