import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../Utils/Axios';
import Api from '../../Api/api';
import classes from './LoginForm.module.css';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Joi from '../../Utils/Joi';
import commonChains from '../../Utils/commonChains';
import { useTranslation } from 'react-i18next';

const LoginForm = (props) => {
	const { t } = useTranslation();
	const [enteredEmail, setEnteredEmail] = useState('');
	const [enteredPassword, setEnteredPassword] = useState('');
	const [error, setError] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [emailError, setEmailError] = React.useState(false);
	const [passwordError, setPasswordError] = React.useState(false);

	const navigate = useNavigate();
	const loginHandler = async (event) => {
		event.preventDefault();
		setEmailError(false);
		setPasswordError(false);

		try {
			await Joi.generator(
				{
					email: commonChains.emailRequired,
					password: commonChains.loginPasswordRequired,
				},
				{ email: enteredEmail, password: enteredPassword }
			);
			setLoading(true);
			const result = await Axios.post({
				url: Api.login,
				data: {
					email: enteredEmail,
					password: enteredPassword,
				},
			});
			setLoading(false);
			if (result.status === 200) {
				const user = result.data.user;
				if (user.role < 3) {
					setErrorMessage(t('roleError'));
					setError(true);
				} else {
					localStorage.setItem('user', JSON.stringify(result.data));
					props.setUser(result.data);
				}
			} else {
				//TODO: Show Error message
				setErrorMessage(t('wrongEmailOrPasswordError'));
				setError(true);
				setEmailError(true);
				setPasswordError(true);
			}
		} catch (e) {
			if (e.message === 'emailValidationError') setEmailError(true);
			if (e.message === 'passwordValidationError') setPasswordError(true);
			setErrorMessage(t(e.message));
			setError(true);
		}
	};

	const emailChangedHandler = (event) => {
		setEnteredEmail(event.target.value);
	};

	const passwordChangedHandler = (event) => {
		setEnteredPassword(event.target.value);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setError(false);
	};

	useEffect(() => {
		if (props.user) {
			navigate('/dashboard');
		}
	}, [props.user, navigate]);

	if (!props.user) {
		return (
			<Fragment>
				<div className={classes.loginForm}>
					<img src={'logo-theAcademy.png'} className={classes.loginFormLogo} alt={'theAcademy'} />
					<h3> {t('login')}</h3>
					<form onSubmit={loginHandler} noValidate>
						<div className={classes.login__control}>
							<img src={'email.svg'} alt={'email'} />
							<TextField
								onChange={emailChangedHandler}
								className={classes.input}
								id="email"
								type="email"
								value={enteredEmail}
								placeholder={t('emailPlaceHolder')}
								variant="standard"
								error={emailError}
							/>
						</div>
						<div className={classes.login__control}>
							<img src={'lock.svg'} alt={'password'} />
							<TextField
								onChange={passwordChangedHandler}
								className={classes.input}
								id="email"
								type="password"
								value={enteredPassword}
								placeholder={t('passwordPlaceHolder')}
								variant="standard"
								error={passwordError}
							/>
						</div>

						<div className={classes.login__actions}>
							<button type="submit">{t('loginButton')}</button>
						</div>
					</form>
				</div>
				<Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error" variant="filled">
						{errorMessage}
					</Alert>
				</Snackbar>
				<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Fragment>
		);
	} else {
		return null;
	}
};

export default LoginForm;
