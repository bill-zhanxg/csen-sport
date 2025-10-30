import { cache } from 'react';

import { auth } from '@/libs/auth';

export const authC = cache(auth);
