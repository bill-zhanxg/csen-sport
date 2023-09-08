'use client';

import { Account, AppwriteException, Client, Models } from 'appwrite';
import { logError } from './logger';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);

/**
 * @param email
 * @param password
 * @throw - {Error}
 */
export function login(email?: string, password?: string) {
	return new Promise<Models.Session>((resolve, reject) => {
		if (!email || !password) return reject(new Error('Email or password is missing or empty'));
		account.createOAuth2Session('microsoft', 'http://localhost:3000', 'http://localhost:3000');
	});
}

export function logout() {
	account
		.deleteSession('current')
		.catch(() => {})
		.finally(() => (window.location.href = '/login'));
}

export function getSession() {
	return new Promise<Models.Session>((resolve, reject) => {
		account
			.getSession('current')
			.then(resolve)
			.catch((error: AppwriteException) => {
				logError(error);
				reject(error);
			});
	});
}
