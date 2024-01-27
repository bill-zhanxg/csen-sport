'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { finishGuide } from './ReacyJoyRideActions';

const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const steps: { title?: ReactNode; target: string; content: string }[] = [
	{
		target: '#home-btn',
		content: 'Click here whenever you want to go back to the homepage',
	},
	{
		target: '#weekly-sport-btn',
		content: 'Click here to access every weekly sport games',
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
		content: 'Click here to access the users page, you have block, unblock, promote and demote users',
	},
	{
		target: '#teams-btn',
		content: 'Click here to access the teams page, you can create, edit and delete teams',
	},
	{
		target: '#venues-btn',
		content: 'Click here to access the venues page, you can create, edit and delete venues',
	},
	{
		target: '#bulk-action-btn',
		content:
			'Click here to access the bulk action page, you can bulk add or remove games. Ideal for when you want to heavily modify the weekly sport games',
	},
	{
		target: '#import-timetables-btn',
		content:
			'Click here to import weekly sport games from PDF, this is where you can import the weekly sport games from the CSEN fixture PDF file',
	},
	{
		target: '#create-timetables-btn',
		content: 'Click here to create weekly sport games manually, this is useful if the automatic import fails',
	},
	{
		target: '#user-settings-btn',
		content:
			'Click here to access your user settings, you can change your name, email and team here (Student can not change name or email)',
	},
	{
		target: '#changelog-btn',
		content:
			'Click here to access the changelog page, you can see all the changes made to this website here. Also this is where you can start this tutorial again',
	},
	{
		target: '#logout-btn',
		content: 'If you ever want to logout, you can click here',
	},
];

const stepsMap = steps.map((step) => [step, { ...step, target: `${step.target}-mobile` }]);

export function ReactJoyride() {
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
				}
				if (event.status === 'finished') finishGuide();
			}}
			steps={stepsMap.flat()}
		/>
	);
}
