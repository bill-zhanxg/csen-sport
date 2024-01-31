import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'CSEN Sport',
		short_name: 'CSEN Sport',
		description: 'Make the management of semester sport easier',
		theme_color: '#2563eb',
		display: 'standalone',
	};
}
