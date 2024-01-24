import dayjsPackage from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsPackage.extend(utc);
dayjsPackage.extend(timezone);

export const dayjs = dayjsPackage;