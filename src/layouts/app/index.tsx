import type { ReactNode } from "react";

type TLayoutProps = {
	children: ReactNode
}

export const Layout = ({ children }: TLayoutProps) => {
	return <div className='flex h-screen w-screen flex-col'>{children}</div>;
};