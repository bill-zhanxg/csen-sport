import { authC } from '@/app/cache';
import { serializeTeams } from '@/libs/serializeData';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import { FaCog, FaUser } from 'react-icons/fa';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { UserAvatar } from '../globalComponents/UserAvatar';
import { SettingsForm } from './components/SettingsForm';

export const metadata: Metadata = {
	title: 'Settings',
};

export default async function Profile() {
	const session = await authC();
	if (!session) return Unauthorized();

	const teams = await getXataClient().db.teams.getAll();

	return (
		<div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-primary to-secondary/50 text-primary-content py-8 px-4 sm:py-12">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{/* Profile Avatar */}
						<div className="relative">
							<div className="avatar">
								<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-primary-content/20 ring-offset-4 ring-offset-transparent">
									<UserAvatar user={session.user} />
								</div>
							</div>
							<div className="absolute -bottom-2 -right-2 bg-primary-content text-primary p-2 rounded-full">
								<FaUser className="w-3 h-3" />
							</div>
						</div>

						{/* User Info */}
						<div className="text-center sm:text-left flex-1">
							<h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{session.user.name}</h1>
							<p className="text-white/90 text-sm sm:text-base mb-2">{session.user.email}</p>
							<div className="flex items-center justify-center sm:justify-start gap-2 text-white/80">
								<FaCog className="w-4 h-4" />
								<span className="text-sm">Account Settings</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto max-w-6xl px-4 py-8 -mt-6 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Sidebar */}
					<div className="lg:col-span-3">
						<div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 sticky top-6">
							<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
								<FaCog className="w-5 h-5 text-primary" />
								Quick Settings
							</h3>
							<div className="space-y-3">
								<a href="#profile-settings" className="block p-3 rounded-lg hover:bg-base-200 transition-colors">
									<div className="font-medium">Profile</div>
									<div className="text-sm text-base-content/70">Personal information</div>
								</a>
								<a href="#team-preferences" className="block p-3 rounded-lg hover:bg-base-200 transition-colors">
									<div className="font-medium">Team Preferences</div>
									<div className="text-sm text-base-content/70">Manage your teams</div>
								</a>
								<a href="#notifications" className="block p-3 rounded-lg hover:bg-base-200 transition-colors">
									<div className="font-medium">Notifications</div>
									<div className="text-sm text-base-content/70">Alert preferences</div>
								</a>
								<a href="#timezone" className="block p-3 rounded-lg hover:bg-base-200 transition-colors">
									<div className="font-medium">Timezone</div>
									<div className="text-sm text-base-content/70">Time & location</div>
								</a>
							</div>
						</div>
					</div>

					{/* Main Settings Form */}
					<div className="lg:col-span-9">
						<div className="bg-base-100 rounded-2xl shadow-xl border border-base-300">
							<SettingsForm session={session} teams={serializeTeams(teams)} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
