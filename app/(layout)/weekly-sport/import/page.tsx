'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';

import { Error, Success } from '../../../components/Alert';
import { TextItem } from '../../testpdf/types';

export default function Import() {
	const [step, setStep] = useState(1);

	const [weeklySportTab, setWeeklySportTab] = useState<'url' | 'upload'>('url');
	const [weeklySportURL, setWeeklySportURL] = useState('');
	const [weeklySportURLDisabled, setWeeklySportURLDisabled] = useState(false);
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);

	const [disableNext, setDisableNext] = useState(true);
	const [nextLoading, setNextLoading] = useState(false);

	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
	}, []);

	async function handleWeeklySportChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) return;
		setNextLoading(true);
		setWeeklySportFileDisabled(true);
		let input = event.target.files[0];
		input
			.arrayBuffer()
			.then((buffer) => {
				pdfjs.getDocument(buffer).promise.then((pdf) => {
					// TODO: combine functions
					pdf.getPage(1).then((page) => {
						page.getTextContent().then((content) => {
							const text = content.items.map((item) => ((item as TextItem).str ? (item as TextItem).str : ''));
							// setPdf(text);
							console.log(text);
						});
					});
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
		pdfjs
			.getDocument(weeklySportURL)
			.promise.then((pdf) => {
				// TODO: combine functions
				pdf.getPage(1).then((page) => {
					page.getTextContent().then((content) => {
						const text = content.items.map((item) => ((item as TextItem).str ? (item as TextItem).str : ''));
						// setPdf(text);
						console.log(text);
					});
				});
			})
			.catch((err) => {
				setNextLoading(false);
				setWeeklySportURLDisabled(false);
				setAlert({
					type: 'error',
					message: `Failed to load the selected file: ${err.message}`,
				});
			});
	}

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<ul className="steps">
					<li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Upload Weekly Sport PDF</li>
					<li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Upload Venue PDF</li>
					<li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Check & Edit</li>
					<li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Finish</li>
				</ul>
				<h1 className="text-4xl font-bold">Import Weekly Sport PDF to Database</h1>

				{step === 1 && (
					<>
						<p className="text-xl font-bold max-w-xl">
							Please find the latest PDF from{' '}
							<Link className="link-secondary link-hover" href="https://csen.org.au/semester-sport/" target="_blank">
								CSEN
							</Link>{' '}
							and import it here
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
								<button
									className="btn btn-accent"
									onClick={handleWeeklySportURLCheck}
									disabled={weeklySportURLDisabled}
								>
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
				)}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => setStep((step) => step - 1)}
						disabled={step === 1}
					>
						Previous
					</button>
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => setStep((step) => step + 1)}
						disabled={disableNext}
					>
						{nextLoading ? (
							<span className="loading loading-spinner loading-md"></span>
						) : step === 4 ? (
							'Finish'
						) : (
							'Next'
						)}
					</button>
				</div>
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<Success message={alert.message} setAlert={setAlert} />
				) : (
					<Error message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
