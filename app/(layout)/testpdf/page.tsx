'use client';

import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { TextItem } from './types';

export default function Test() {
	const [pdf, setPdf] = useState<string[] | null>(null);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
		// fetch('https://csen.org.au/wp-content/uploads/2023/07/23-SEMESTER-TWO-SPORT-FIXTURES-1-1.pdf', {
		// 	mode: 'no-cors',
		// }).then(console.log).catch(console.error)
		pdfjs
			.getDocument({
				url: `https://corsproxy.io/?${encodeURIComponent(
					'https://csen.org.au/wp-content/uploads/2023/07/23-SEMESTER-TWO-SPORT-FIXTURES-1-1.pdf',
				)}`,
				httpHeaders: {
					'Sec-Fetch-Mode': 'no-cors',
				},
			})
			.promise.then((pdf) => {
				pdf.getPage(2).then((page) => {
					page.getTextContent().then((content) => {
						console.log(content.items);

						const text = content.items.filter((item) => (item as TextItem).str).map((item) => (item as TextItem).str);
						setPdf(text);
						console.log(text.join(' '));
					});
				});
			});
	}, []);

	const getFirstDecimal = (num: number) => Math.floor((num % 1) * 10);

	// fetch('/fixture.pdf')
	// 	.then(async (res) => {
	// 		const arrayBuffer = await res.arrayBuffer();
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 	});

	return (
		<div>
			<p>
				{pdf
					? pdf.map((item, index) => (
							<span
								key={index}
								className={
									index % 3 === 0
										? 'text-red-500'
										: getFirstDecimal(index / 3) == 3
										? 'text-green-500'
										: 'text-blue-500'
								}
							>
								{item}{' '}
							</span>
					  ))
					: 'Loading...'}
			</p>
		</div>
	);
}
