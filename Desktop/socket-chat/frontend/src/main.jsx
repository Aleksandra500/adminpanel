import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom';
import LoginPage from './page/LoginPage.jsx';
import Chat from './Chat.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <div>error</div>,
		children: [
      {
        path: '/login',
        element: <LoginPage/>
      },
      {
        path: '/chat',
        element: <Chat/>
      }
    ],
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
