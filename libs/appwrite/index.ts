// 'use client';

// import { Account, AppwriteException, Avatars, Client, Databases, ID, Models, Query, Teams } from 'appwrite';

// import {
// 	DateInterfaceDocument,
// 	GameDocument,
// 	QueryPickDocument,
// 	Teacher,
// 	TeacherDocument,
// } from './Interface/Weekly-sport';

// export const client = new Client()
// 	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
// 	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// // TODO: handle you have been blocked
// export const account = {
// 	appwrite: new Account(client),

// 	login: (href?: string | null) => {
// 		const pathname = href === undefined ? window.location.href : href === null ? process.env.ROOT_URL : href;
// 		account.appwrite.createOAuth2Session('microsoft', pathname, pathname);
// 	},

// 	logout: () => {
// 		account.appwrite
// 			.deleteSession('current')
// 			.catch(() => {})
// 			.finally(() => location.reload());
// 	},

// 	getJWT: () => {
// 		return new Promise<string>((resolve, reject) => {
// 			account.appwrite
// 				.createJWT()
// 				.then((res) => {
// 					resolve(res.jwt);
// 				})
// 				.catch((error: AppwriteException) => reject(appwriteError(error)));
// 		});
// 	},

// 	getSession: (redirect = true) => {
// 		return new Promise<Models.Session>((resolve, reject) => {
// 			account.appwrite
// 				.getSession('current')
// 				.then(resolve)
// 				.catch((error: AppwriteException) => reject(redirect ? appwriteError(error) : null));
// 		});
// 	},

// 	getUser: () => {
// 		return new Promise<Models.User<Models.Preferences>>((resolve, reject) => {
// 			account.appwrite
// 				.get()
// 				.then(resolve)
// 				.catch((error: AppwriteException) => reject(appwriteError(error)));
// 		});
// 	},

// 	/**
// 	 * This function return the avatar url
// 	 */
// 	getAvatar: () => {
// 		return new Avatars(client).getInitials();
// 	},

// 	/**
// 	 * Check if the user is an administrator
// 	 * @throws {AppwriteException}
// 	 */
// 	checkAdministrator: () => {
// 		return new Promise<boolean>((resolve, reject) => {
// 			const team = new Teams(client);
// 			team
// 				.list()
// 				.then((res) => console.log(res))
// 				.catch((error: AppwriteException) => console.log(error));
// 			team
// 				.get('administrator')
// 				// User is an administrator
// 				.then(() => resolve(true))
// 				.catch((error: AppwriteException) => {
// 					// User is not an administrator
// 					if (error.code === 404) resolve(false);
// 					// Something went wrong
// 					else reject(error);
// 				});
// 		});
// 	},
// };

// export const database = {
// 	appwrite: new Databases(client),
// 	name: 'weekly-sport',

// 	/**
// 	 * Get documents from date collection
// 	 * @throws {AppwriteException}
// 	 */
// 	getDates: () => {
// 		return new Promise<DateInterfaceDocument[]>((resolve, reject) => {
// 			database.appwrite
// 				.listDocuments<DateInterfaceDocument>(database.name, 'date', [Query.orderDesc('day')])
// 				.then((res) => {
// 					resolve(res.documents);
// 				})
// 				.catch((error: AppwriteException) => reject(appwriteError(error)));
// 		});
// 	},

// 	/**
// 	 * Get documents from teacher collection
// 	 * @throws {AppwriteException}
// 	 */
// 	getMyGames: () => {
// 		return new Promise<GameDocument[]>((resolve, reject) => {
// 			account
// 				.getUser()
// 				.then((user) => {
// 					database.appwrite
// 						.listDocuments<TeacherDocument>(database.name, 'teacher', [Query.equal('email', user.email)])
// 						.then((res) => {
// 							resolve(res.documents[0]?.game || []);
// 						})
// 						.catch((error: AppwriteException) => reject(appwriteError(error)));
// 				})
// 				.catch(reject);
// 		});
// 	},

// 	/**
// 	 * Get documents from game collection
// 	 * @throws {AppwriteException}
// 	 */
// 	getGames: () => {
// 		return new Promise<GameDocument[]>((resolve, reject) => {
// 			database.appwrite
// 				.listDocuments<GameDocument>(database.name, 'game')
// 				.then((res) => {
// 					resolve(res.documents);
// 				})
// 				.catch((error: AppwriteException) => reject(appwriteError(error)));
// 		});
// 	},

// 	teachers: {
// 		name: 'teacher',

// 		get: (documentId: string) => {
// 			return new Promise<TeacherDocument | null>((resolve, reject) => {
// 				database.appwrite
// 					.getDocument<TeacherDocument>(database.name, database.teachers.name, documentId)
// 					.then(resolve)
// 					.catch((error: AppwriteException) => {
// 						if (error.code === 404) return resolve(null);
// 						appwriteError(error);
// 						reject(error);
// 					});
// 			});
// 		},

// 		getAll: () => {
// 			return new Promise<QueryPickDocument<TeacherDocument, '$id' | 'name' | 'email'>[]>((resolve, reject) => {
// 				database.appwrite
// 					.listDocuments<TeacherDocument>(database.name, database.teachers.name, [
// 						Query.orderAsc('name'),
// 						Query.select(['$id', 'name', 'email']),
// 					])
// 					.then((res) => {
// 						resolve(res.documents);
// 					})
// 					.catch((error: AppwriteException) => reject(appwriteError(error)));
// 			});
// 		},

// 		create: (name?: string, email?: string) => {
// 			return new Promise<TeacherDocument>((resolve, reject) => {
// 				if (!name || !email) return reject(new Error('Name or email is missing'));
// 				database.appwrite
// 					.createDocument<TeacherDocument>(database.name, database.teachers.name, ID.unique(), {
// 						name,
// 						email: `${email}@${process.env.NEXT_PUBLIC_SCHOOL_EMAIL_DOMAIN}`,
// 					})
// 					.then(resolve)
// 					.catch((error: AppwriteException) => reject(appwriteError(error)));
// 			});
// 		},

// 		/**
// 		 * Delete one or more documents from teacher collection
// 		 *
// 		 * If there is only one document it will reject if failed
// 		 *
// 		 * If there are multiple documents it will not throw any error, but return the number of succeed and failed
// 		 *
// 		 * @throws {AppwriteException}
// 		 */
// 		delete: (documentId: string | string[]) => {
// 			return new Promise<{ succeed: number; failed: number }>(async (resolve, reject) => {
// 				if (typeof documentId === 'string')
// 					deleteDocument(documentId)
// 						.then(() => resolve({ succeed: 1, failed: 0 }))
// 						.catch((error: AppwriteException) => reject(appwriteError(error)));
// 				else {
// 					const promises = documentId.map((id) => deleteDocument(id));
// 					const result = await Promise.allSettled(promises);

// 					const succeed = result.filter(({ status }) => status === 'fulfilled').length;
// 					const failed = result.length - succeed;
// 					resolve({ succeed, failed });
// 				}

// 				function deleteDocument(id: string) {
// 					return database.appwrite.deleteDocument(database.name, database.teachers.name, id);
// 				}
// 			});
// 		},

// 		update: (documentId: string, data: Partial<Teacher>) => {
// 			return new Promise<TeacherDocument>((resolve, reject) => {
// 				database.appwrite
// 					.updateDocument<TeacherDocument>(database.name, database.teachers.name, documentId, data)
// 					.then(resolve)
// 					.catch((error: AppwriteException) => reject(appwriteError(error)));
// 			});
// 		},
// 	},
// };

// function appwriteError(error: AppwriteException): AppwriteException {
// 	if (error.code === 401) {
// 		// Redirect to login page
// 		const url = new URL(`${location.protocol}//${location.host}/login`)
// 		url.searchParams.set('href', location.href);
// 		location.href = url.href;
// 		return new AppwriteException("You're not logged in. Redirecting to login page...", 401);
// 	}
// 	console.error(error);
// 	return error;
// }
