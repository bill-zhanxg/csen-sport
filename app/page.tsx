export default function Home() {
	return (
		<main className="flex justify-center items-center h-full">
			<div className="flex flex-col bg-base-200 p-10 rounded-lg w-96">
				<h1 className="text-center font-bold mb-4">CCS Sport Login</h1>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Email</span>
					</label>
					<input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
					<label className="label">
						<span className="label-text">Password</span>
					</label>
					<input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          <button className="btn btn-primary mt-4">Login</button>
				</div>
			</div>
		</main>
	);
}
