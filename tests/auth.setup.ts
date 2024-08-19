import { expect, Page, test as setup } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';
const developerFile = 'playwright/.auth/developer.json';
const teacherFile = 'playwright/.auth/teacher.json';
const studentFile = 'playwright/.auth/student.json';
const blockedFile = 'playwright/.auth/blocked.json';

setup('authenticate as admin', async ({ page }) => {
	await signIn(page, process.env.TEST_LOGIN_ADMIN_PASSWORD, adminFile);
});

setup('authenticate as developer', async ({ page }) => {
	await signIn(page, process.env.TEST_LOGIN_DEVELOPER_PASSWORD, developerFile);
});

setup('authenticate as teacher', async ({ page }) => {
	await signIn(page, process.env.TEST_LOGIN_TEACHER_PASSWORD, teacherFile);
});

setup('authenticate as student', async ({ page }) => {
	await signIn(page, process.env.TEST_LOGIN_STUDENT_PASSWORD, studentFile);
});

setup('authenticate as blocked', async ({ page }) => {
	await signIn(page, process.env.TEST_LOGIN_BLOCKED_PASSWORD, blockedFile);
});

async function signIn(page: Page, password: string, path: string) {
	const res = await page.request.post('/login/test', { data: { password } });
	expect(res.status()).toBe(200);
	await page.context().storageState({ path });
}
