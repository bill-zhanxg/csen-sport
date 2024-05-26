import { z } from 'zod';

export const RoleSchema = z.literal('student').or(z.literal('teacher')).or(z.literal('admin')).or(z.literal('blocked'));
