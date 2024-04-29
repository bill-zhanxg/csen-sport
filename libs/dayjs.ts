import dayjsPackage from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsPackage.extend(utc);
dayjsPackage.extend(timezone);
dayjsPackage.extend(relativeTime);
dayjsPackage.extend(customParseFormat);
dayjsPackage.extend(localizedFormat);
dayjsPackage.extend(isToday);
dayjsPackage.extend(isYesterday);

export const dayjs = dayjsPackage;
