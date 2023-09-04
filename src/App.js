import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Alert, Snackbar } from '@mui/material';
import ErrorContext from './ErrorContext';

function App() {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
	const [error, setError] = useState({ inError: false, errorMessage: '' });

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setError({ inError: false, errorMessage: '' });
	};

	const { t, i18n } = useTranslation();
	let to = user ? '/dashboard' : '/login';
	document.dir = i18n.dir();
	document.title = t('theAcademy');
	return (
		<ErrorContext.Provider value={{ error, setError }}>
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path="/" exact element={<Navigate to={to} />} />

					<Route path="/login" exact element={<Login user={user} setUser={setUser} />} />

					<Route path="/dashboard/*" element={<Dashboard user={user} setUser={setUser} />} />
				</Routes>
				<Snackbar open={error.inError} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error" variant="filled">
						{error.errorMessage}
					</Alert>
				</Snackbar>
			</ThemeProvider>
		</ErrorContext.Provider>
	);
}

export default App;
