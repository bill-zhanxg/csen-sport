import { z } from 'zod/v4';

export const RoleSchema = z.literal('student').or(z.literal('teacher')).or(z.literal('admin')).or(z.literal('blocked'));
