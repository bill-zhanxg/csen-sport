import { dayjs } from './dayjs';
import { SearchParams } from './types';

export function formatIsJunior(isJunior?: boolean | null): string {
	return isJunior ? 'Junior' : 'Intermediate';
}

export function stringifySearchParam(searchParams: SearchParams): { [key: string]: string | undefined } {
	for (const key in searchParams) {
		if (Array.isArray(searchParams[key])) searchParams[key] = searchParams[key]?.[0];
	}
	return searchParams as { [key: string]: string | undefined };
}

export function formatTime(date?: Date | null, time?: string | null, timezone = dayjs.tz.guess()): Date | undefined {
	if (!date || !time) return undefined;
	return dayjs.tz(`${dayjs.tz(date, timezone).format('YYYY-MM-DD')} ${time}`, timezone).toDate();
}
