import { BrowserRouter, Routes, Route } from 'react-router';
import { withProvider } from '../shared/utils';
import { Layout } from '../layouts/app';
import { Home } from '../pages/home';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register'; 
import { StoreProvider } from '../shared/utils/store-provider';
import { useWebSocket } from '../shared/hooks/use-websocket';
import './style/App.css';

const ROUTES = [
	{
		path: '/',
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
];

export const App = withProvider(BrowserRouter)(() => {

	return (
		<StoreProvider>
			<Layout>
				<Routes>
					{ROUTES.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}
				</Routes>
			</Layout>
		</StoreProvider>
	);
});
