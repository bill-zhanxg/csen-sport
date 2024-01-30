import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'CSEN Sport',
		short_name: 'CSEN Sport',
		theme_color: '#2563eb',
		display: 'standalone',
	};
}
