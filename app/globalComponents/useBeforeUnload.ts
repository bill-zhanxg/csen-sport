import { useEffect } from 'react';
import { useBeforeUnload as _useBeforeUnload } from 'react-use';

export const useBeforeUnload = (isConfirm = true, message = 'Are you sure want to leave this page?') => {
	// check when page is about to be reloaded
	_useBeforeUnload(isConfirm, message);

	// check when page is about to be changed
	useEffect(() => {
		function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
			const currentUrlObj = new URL(currentUrl);
			const newUrlObj = new URL(newUrl);
			// Compare hostname, pathname, and search parameters
			if (
				currentUrlObj.hostname === newUrlObj.hostname &&
				currentUrlObj.pathname === newUrlObj.pathname &&
				currentUrlObj.search === newUrlObj.search
			) {
				// Check if the new URL is just an anchor of the current URL page
				const currentHash = currentUrlObj.hash;
				const newHash = newUrlObj.hash;
				return (
					currentHash !== newHash && currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
				);
			}
			return false;
		}

		function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
			while (element && element.tagName.toLowerCase() !== 'a') {
				element = element.parentElement;
			}
			return element as HTMLAnchorElement;
		}
		function handleClick(event: MouseEvent) {
			try {
				const target = event.target as HTMLElement;
				const anchor = findClosestAnchor(target);
				if (anchor) {
					const currentUrl = window.location.href;
					const newUrl = (anchor as HTMLAnchorElement).href;
					const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);
					const isDownloadLink = (anchor as HTMLAnchorElement).download !== '';
					const isExternalLink = (anchor as HTMLAnchorElement).target === '_blank';

					const isPageLeaving = !(newUrl === currentUrl || isAnchor || isDownloadLink);

					if (isPageLeaving && !isExternalLink && isConfirm && !window.confirm(message)) {
						// Cancel the route change
						event.preventDefault();
						event.stopPropagation();
					}
				}
			} catch (err) {
				alert(err);
			}
		}

		// Add the global click event listener
		document.addEventListener('click', handleClick, true);

		// Clean up the global click event listener when the component is unmounted
		return () => {
			document.removeEventListener('click', handleClick, true);
		};
	}, [isConfirm, message]);
};
