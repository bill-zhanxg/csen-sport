export function Tabs({ children }: { children: React.ReactNode }) {
	return (
		<div role="tablist" className="tabs tabs-bordered tabs-lg bg-base-200 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200">
			{children}
		</div>
	);
}
