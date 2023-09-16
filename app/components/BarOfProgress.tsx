'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const BarOfProgress = () => {
	return <ProgressBar height="4px" color="#2563eb" options={{ showSpinner: false }} shallowRouting delay={100} />;
};

export default BarOfProgress;
