'use client';

import { useEffect } from 'react';

import { dayjs } from '@/libs/dayjs';

import { setUserTimezone } from './actions';

export function HandleUserTimezone() {
	useEffect(() => {
		setUserTimezone(dayjs.tz.guess());
	}, []);

	return null;
}
