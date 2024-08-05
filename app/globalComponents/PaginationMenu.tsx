'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { useCallback } from 'react';
import { Pagination, PaginationList, PaginationNext, PaginationPrev } from 'react-unstyled-pagination';

export function PaginationMenu({ totalPages, ...props }: { totalPages: number }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());

			if (value === '1') params.delete(name);
			else params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	return (
		<Pagination
			page={currentPage}
			onPageChange={(page) => router.push(`${pathname}?${createQueryString('page', page.toString())}`)}
			total={Math.max(totalPages, 1)}
			boundaries={1}
			siblings={1}
			className="mx-auto flex items-center justify-center gap-1 w-full"
			{...props}
		>
			<PaginationPrev className="w-[40px] h-[40px] rounded-lg data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed border-2 border-base-300 hover:bg-base-200">{`<`}</PaginationPrev>
			<PaginationList className="w-[40px] h-[40px] relative rounded-lg data-[active=true]:bg-primary data-[active=true]:text-primary-content transition-all border-2 border-base-300 hover:bg-base-200" />
			<PaginationNext className="w-[40px] h-[40px] rounded-lg data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed border-2 border-base-300 hover:bg-base-200">{`>`}</PaginationNext>
		</Pagination>
	);
}
