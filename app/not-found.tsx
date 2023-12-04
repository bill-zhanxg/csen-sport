import './not-found.css';

export default function NotFound() {
	return (
		<div className='gap-2' id="div-1">
			<div>
				<h1 className="next-error-h1">404</h1>
				<div id="div-2">
					<h2>This page could not be found.</h2>
				</div>
			</div>
			<a className='btn btn-primary w-full max-w-[15rem]' href='/'>Back to Home</a>
		</div>
	);
}
