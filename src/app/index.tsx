import { BrowserRouter, Routes, Route } from 'react-router';
import { withProvider } from '@/shared/utils';
import { Layout } from '@/layouts/app';
import { Home } from '@pages/home';
import { LoginPage } from '@pages/login';
import { RegisterPage } from '@pages/register'; 
import { StoreProvider } from './providers'; 
import { SocketProvider } from './providers';
import './style/App.css';

const ROUTES = [
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/home',
		element: <Home />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '*',
		element: <LoginPage />,
	}
];

export const App = withProvider(BrowserRouter)(() => {

	return (
		<StoreProvider>
			<SocketProvider>
				<Layout>
					<Routes>
						{ROUTES.map(({ path, element }) => (
							<Route key={path} path={path} element={element} />
						))}
					</Routes>
				</Layout>
			</SocketProvider>
		</StoreProvider>
	);
});
