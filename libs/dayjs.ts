import dayjsPackage from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsPackage.extend(utc);
dayjsPackage.extend(timezone);
dayjsPackage.extend(relativeTime);

export const dayjs = dayjsPackage;
