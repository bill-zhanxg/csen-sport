import { Signal } from '@preact/signals-react';
import Link from 'next/link';
import { useState } from 'react';
import { pdfjs as PDFJS } from 'react-pdf';
import { Venues } from './types';
import { TextItem } from './pdfjsTypes';

export function Step2({
	setNextLoading,
	setDisableNext,
	setAlert,
	pdfjs,
	venues,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	pdfjs: typeof PDFJS;
	venues: Signal<Venues>;
}) {
	const [weeklySportTab, setWeeklySportTab] = useState<'url' | 'upload'>('url');
	const [weeklySportURL, setWeeklySportURL] = useState('');
	const [weeklySportURLDisabled, setWeeklySportURLDisabled] = useState(false);
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);

	async function handleWeeklySportChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files?.[0]) return;
		setNextLoading(true);
		setWeeklySportFileDisabled(true);
		let input = event.target.files[0];
		input
			.arrayBuffer()
			.then((buffer) => {
				handlePdfText(buffer)
					.catch(() => {})
					.finally(() => {
						setNextLoading(false);
						setWeeklySportFileDisabled(false);
					});
			})
			.catch((err) => {
				setNextLoading(false);
				setWeeklySportFileDisabled(false);
				setAlert({
					type: 'error',
					message: `Failed to load the selected file: ${err.message}`,
				});
			});
	}
	function handleWeeklySportURLCheck() {
		if (!weeklySportURL.trim())
			return setAlert({
				type: 'error',
				message: `URL is empty`,
			});
		setNextLoading(true);
		setWeeklySportURLDisabled(true);
		handlePdfText(weeklySportURL)
			.catch(() => {})
			.finally(() => {
				setNextLoading(false);
				setWeeklySportURLDisabled(false);
			});
	}

	function handlePdfText(input: string | ArrayBuffer) {
		return new Promise((resolve, reject) => {
			pdfjs
				.getDocument(typeof input === 'string' ? `https://corsproxy.io/?${encodeURIComponent(input)}` : input)
				.promise.then(async (pdf) => {
					const pages: Venues = [];

					for (let i = 1; i <= pdf.numPages; i++) {
						await pdf
							.getPage(i)
							.then(async (page) => {
								await page
									.getTextContent()
									.then((content) => {
										// Begin of algorithm
										const data = (content.items.filter((item) => (item as TextItem).str) as TextItem[]).map(
											({ str, transform }) => ({ str, transform }),
										);

										/**
										 * 0 - Finding 'csen code' or 'csencode'
										 * 1 - Data extraction venue, address, court/field number, and csen code
										 */
										let steps = 0;
										let previousText = '';

										// For step 1
										let previousYPos = 0;
										let previousRows: {
											text: string;
											xPos: number;
										}[] = [];
										let venues: {
											venue: string;
											address: string;
											cfNum: string;
											csenCode: string;
										}[] = [];

										for (const { str, transform } of data) {
											const text = str;

											if (steps === 0) {
												if (!text) continue;
												previousText = (previousText + text).toLowerCase();
												if (previousText.includes('csen code') || previousText.includes('csencode')) {
													steps = 1;
													previousText = '';
												}
												continue;
											}

											if (steps === 1) {
												if (!text) continue;
												const currentXPos = transform[4];
												const currentYPos = transform[5];
												if (previousYPos === 0) previousYPos = currentYPos;

												if (Math.abs(previousYPos - currentYPos) > 5) {
													// Next Row
													const row = {
														venue: '',
														address: '',
														cfNum: '',
														csenCode: '',
													};
													for (const { text, xPos } of previousRows) {
														const addText = (col: keyof typeof row) => (row[col] = (row[col] + text).toLowerCase());
														if (xPos < 200) addText('venue');
														else if (xPos < 450) addText('address');
														else if (xPos < 520) addText('cfNum');
														else addText('csenCode');
													}

													Object.keys(row).forEach((key) => {
														row[key as keyof typeof row] = row[key as keyof typeof row].replace(/\s\s+/g, ' ').trim();
													});
													venues.push(row);
													previousRows = [];
													previousYPos = currentYPos;
												}
												previousRows.push({ text, xPos: currentXPos });
											}
										}
										// End of algorithm

										if (venues.length === 0) {
											setAlert({
												type: 'error',
												message: `Failed to extract venue, address, court/field number, and csen code from the PDF`,
											});
										} else {
											pages.push(...venues);
										}
									})
									.catch((err) => {
										setAlert({
											type: 'error',
											message: `Failed to read the text in PDF page ${i}: ${err.message}`,
										});
									});
							})
							.catch((err) => {
								setAlert({
									type: 'error',
									message: `Failed to read PDF page ${i}: ${err.message}`,
								});
							});
					}

					// Process the data
					if (pages.length === 0) {
						setAlert({
							type: 'error',
							message: `Failed to extract venue, address, court/field number, and csen code from the PDF`,
						});
						return reject(new Error('PDF is empty'));
					} else {
						venues.value = pages;
						setAlert({
							type: 'success',
							message: 'Successfully extracted required information from the PDF, you can now continue',
						});
						setDisableNext(false);
						resolve(null);
					}
				})
				.catch((err) => {
					setAlert({
						type: 'error',
						message: `Failed to load the selected file: ${err.message}`,
					});
					reject(err);
				});
		});
	}

	return (
		<>
			<p className="text-xl font-bold text-center max-w-3xl">
				Please find the latest venue directory PDF from{' '}
				<Link className="link-secondary link" href="https://csen.org.au/semester-sport/" target="_blank">
					CSEN
				</Link>{' '}
				then import it here
			</p>
			<div role="tablist" className="tabs tabs-lg tabs-bordered">
				<button
					role="tab"
					className={`tab ${weeklySportTab === 'url' ? 'tab-active' : ''}`}
					onClick={() => setWeeklySportTab('url')}
					disabled={weeklySportFileDisabled}
				>
					URL
				</button>
				<button
					role="tab"
					className={`tab ${weeklySportTab === 'url' ? '' : 'tab-active'}`}
					onClick={() => setWeeklySportTab('upload')}
					disabled={weeklySportURLDisabled}
				>
					Upload
				</button>
			</div>
			{weeklySportTab === 'url' ? (
				<div className="flex gap-2 w-full max-w-xl">
					<input
						type="text"
						value={weeklySportURL}
						placeholder="Input URL of the PDF here"
						className="input input-bordered w-full"
						onChange={(event) => setWeeklySportURL(event.target.value)}
						disabled={weeklySportURLDisabled}
					/>
					<button className="btn btn-accent" onClick={handleWeeklySportURLCheck} disabled={weeklySportURLDisabled}>
						Check
					</button>
				</div>
			) : (
				<input
					type="file"
					className="file-input file-input-bordered w-full max-w-xl"
					accept=".pdf"
					onChange={handleWeeklySportChange}
					disabled={weeklySportFileDisabled}
				/>
			)}
		</>
	);
}
