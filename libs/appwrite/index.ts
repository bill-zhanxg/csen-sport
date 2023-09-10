'use client';

import { Account, AppwriteException, Client, Databases, Models, Query } from 'appwrite';

import { logError } from '../logger';
import { DateInterfaceDocument, GameDocument, TeacherDocument } from './Interface/Weekly-Sport';

export const client = new Client()
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = {
	appwrite: new Account(client),

	login: () => {
		const pathname = window.location.href || process.env.ROOT_URL;
		account.appwrite.createOAuth2Session('microsoft', pathname, pathname);
	},

	logout: () => {
		account.appwrite
			.deleteSession('current')
			.catch(() => {})
			.finally(() => location.reload());
	},

	getSession: () => {
		return new Promise<Models.Session>((resolve, reject) => {
			account.appwrite
				.getSession('current')
				.then(resolve)
				.catch((error: AppwriteException) => {
					appwriteError(error);
					reject(error);
				});
		});
	},

	getUser: () => {
		return new Promise<Models.User<Models.Preferences>>((resolve, reject) => {
			account.appwrite
				.get()
				.then(resolve)
				.catch((error: AppwriteException) => {
					appwriteError(error);
					reject(error);
				});
		});
	},
};

export const database = {
	appwrite: new Databases(client),

	/**
	 * Get documents from date collection
	 * @throws {AppwriteException}
	 */
	getDates: () => {
		return new Promise<DateInterfaceDocument[]>((resolve, reject) => {
			database.appwrite
				.listDocuments<DateInterfaceDocument>('weekly-sport', 'date', [Query.orderDesc('day')])
				.then((res) => {
					resolve(res.documents);
				})
				.catch((error: AppwriteException) => {
					appwriteError(error);
					reject(error);
				});
		});
	},

	/**
	 * Get documents from date collection
	 * @throws {AppwriteException}
	 */
	getMyGames: () => {
		return new Promise<GameDocument[]>((resolve, reject) => {
			account
				.getUser()
				.then((user) => {
					database.appwrite
						.listDocuments<TeacherDocument>('weekly-sport', 'teacher', [Query.equal('email', user.email)])
						.then((res) => {
							resolve(res.documents[0].game || []);
						})
						.catch((error: AppwriteException) => {
							appwriteError(error);
							reject(error);
						});
				})
				.catch(reject);
		});
	},

	/**
	 * Get documents from game collection
	 * @throws {AppwriteException}
	 */
	getGames: () => {
		return new Promise<GameDocument[]>((resolve, reject) => {
			database.appwrite
				.listDocuments<GameDocument>('weekly-sport', 'game')
				.then((res) => {
					resolve(res.documents);
				})
				.catch((error: AppwriteException) => {
					appwriteError(error);
					reject(error);
				});
		});
	},
};

function appwriteError(error: AppwriteException) {
	if (error.code === 401) account.login();
	logError(error);
}
