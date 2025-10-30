'use client';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

import { finishGuide } from './ReactJoyRideActions';

import type { ReactNode} from 'react';
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const steps: { title?: ReactNode; target: string; content: string }[] = [
	{
		target: '#home-btn',
		content: 'Click here to return to your homepage',
	},
	{
		target: '#weekly-sport-btn',
		content: 'Click here to access the weekly sport schedule',
	},
	{
		target: '#tickets-btn',
		content:
			'Manage, view, or create tickets here. These requests might be for troubleshooting issues, getting help with a service, or asking any questions you might have',
	},
	{
		target: '#csen-btn',
		content: 'Click here to view the official CSEN website',
	},
	{
		target: '#admin-control-btn',
		content: 'You can click here to expand the admin controls dropdown menu',
	},
	{
		target: '#users-btn',
		content: 'Click here to access the users page. Here you can block, unblock, promote and demote users',
	},
	{
		target: '#teams-btn',
		content: 'Click here to access the teams page. Here you can create, edit and delete teams',
	},
	{
		target: '#venues-btn',
		content: 'Click here to access the venues page. Here you can create, edit and delete venues',
	},
	{
		target: '#bulk-action-btn',
		content:
			'Click here to access the bulk action page. Here you can add or remove games in bulk. Ideal for heavy modification to the weekly sport schedule',
	},
	{
		target: '#import-timetables-btn',
		content: 'Click here to import a weekly sport schedule using the CSEN venue and fixture PDFs',
	},
	{
		target: '#create-timetables-btn',
		content: 'Click here to create weekly sport games manually. This is useful if the automatic import fails',
	},
	{
		target: '#user-settings-btn',
		content:
			'Click here to access your user settings. Here you can change your name, email and team (Students can not change name or email)',
	},
	{
		target: '#changelog-btn',
		content:
			'Click here to access the changelog page. Here you can see all the changes made to this website. *Note: You can restart the tutorial from this page',
	},
	{
		target: '#feedback-btn',
		content: 'Click here to submit feedback',
	},
	{
		target: '#logout-btn',
		content: 'Click here to log out',
	},
];

const stepsMap = steps.map((step) => [step, { ...step, target: `${step.target}-mobile` }]);

export function ReactJoyride() {
	const foundAdminControlBtn = useRef(true);

	function openMenu(menu: HTMLElement | null) {
		if (menu) {
			menu.style.setProperty('visibility', 'visible', 'important');
			menu.style.setProperty('opacity', '1', 'important');
		}
	}
	function closeMenu(menu: HTMLElement | null) {
		if (menu) {
			menu.style.removeProperty('visibility');
			menu.style.removeProperty('opacity');
		}
	}

	return (
		<Joyride
			run
			continuous
			showSkipButton
			scrollOffset={300}
			callback={(event) => {
				if (event.type === 'step:before') {
					if (event.step.target === '#users-btn') document.getElementById('admin-control-btn')?.click();
				}
				if (event.type === 'step:after') {
					if (event.step.target === '#create-timetables-btn' || event.step.target === '#create-timetables-btn-mobile') {
						document.getElementById('admin-control-btn')?.click();

						// Start user-menu
						openMenu(document.getElementById('user-menu'));
						closeMenu(document.getElementById('mobile-menu'));
					}
					if (event.step.target === '#logout-btn') {
						closeMenu(document.getElementById('user-menu'));
					}
				}
				if (event.type === 'error:target_not_found') {
					if (event.step.target === '#weekly-sport-btn') openMenu(document.getElementById('mobile-menu'));
					if (event.step.target === '#admin-control-btn') foundAdminControlBtn.current = false;
					if (event.step.target === '#admin-control-btn-mobile' && !foundAdminControlBtn.current)
						openMenu(document.getElementById('user-menu'));
				}
				if (event.status === 'finished') finishGuide();
			}}
			steps={stepsMap.flat()}
			styles={{
				options: {
					backgroundColor: 'var(--color-base-100)',
					textColor: 'var(--color-base-content)',
					primaryColor: 'var(--color-primary)',
					arrowColor: 'var(--color-base-100)',
				},
			}}
		/>
	);
}
