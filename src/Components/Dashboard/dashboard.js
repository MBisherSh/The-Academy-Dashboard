import React, { useEffect, useState, useContext } from 'react';
import Permissions from './Pages/Permissions/Permissions';
import Payments from './Pages/Payments/Payments';
import Users from './Pages/Users/Users';
import Categories from './Pages/Categories/Categories';
import Courses from './Pages/Courses/Courses';
import Privacy from './Pages/Privacy/Privacy';
import Home from './Pages/Home/Home';
import ResponsiveDrawer from '../Layout/ResponsiveDrawer';
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import Subjects from './Pages/Categories/Subjects/Subjects';
import Axios from '../../Utils/Axios';
import Api from '../../Api/api';
import ErrorContext from '../../ErrorContext';
import { useTranslation } from 'react-i18next';
import PermissionsContext from '../../PermissionsContext';
import { CircularProgress, Container, Typography } from '@mui/material';
import theAcademyLogo from '../../assets/logo-theAcademy.png'
const Dashboard = (props) => {
	const navigate = useNavigate();
	const user = props.user;
	const { t } = useTranslation();
	const [permissions, setPermissions] = useState({});
	const [loading, setLoading] = useState(true);
	const { setError } = useContext(ErrorContext);
	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);
	useEffect(() => {
		const getPermissions = async () => {
			const result = await Axios.get(Api.permissions);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 200) {
					setPermissions(result.data.data);
					setLoading(false);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
		};
		getPermissions();
	}, [setError, t]);

	if (loading) {
		// Render loading state or a spinner while permissions are being fetched
		return ( <Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
			}}
		>
			<img src={theAcademyLogo} alt="App Logo" style={{ width: 100, marginBottom: 16 }} />
			<Typography variant="h6" component="div" align="center">
				{t('loading')}
			</Typography>
			<CircularProgress />
		</Container>)
	}

	if (user)
		return (
			<PermissionsContext.Provider value={{ permissions, setPermissions }}>
				<ResponsiveDrawer user={props.user} setUser={props.setUser}>
					<Routes>
						<Route
							path="/rbac"
							exact
							element={<Permissions generalPermissions={permissions} user={props.user} />}
						/>

						<Route path="/payments" exact element={<Payments user={props.user} />} />

						<Route path="/users" exact element={<Users user={props.user} />} />

						<Route path="/categories" exact element={<Categories user={props.user} />} />

						<Route path="/categories/:categoryId" element={<Subjects user={props.user} />} />

						<Route path="/courses" exact element={<Courses user={props.user} />} />

						<Route path="/privacy-policy" exact element={<Privacy user={props.user} />} />

						<Route path="/*" element={<Home user={props.user} />} />
					</Routes>
					<Outlet />
				</ResponsiveDrawer>
			</PermissionsContext.Provider>
		);
	else {
		return null;
	}
};

export default Dashboard;
