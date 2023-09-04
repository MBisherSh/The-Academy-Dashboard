import React, { useState, useEffect, useContext } from 'react';
import {
	TextField,
	Button,
	Card,
	Link,
	Typography,
	Breadcrumbs,
	Grid,
	CircularProgress,
	Backdrop,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import ErrorContext from '../../../../ErrorContext';

const PrivacyPolicyEditor = (props) => {
	const { t } = useTranslation();
	const [privacyPolicyEn, setPrivacyPolicyEn] = useState('');
	const [privacyPolicyEnValue, setPrivacyPolicyEnValue] = useState('');
	const [privacyPolicyAr, setPrivacyPolicyAr] = useState('');
	const [privacyPolicyArValue, setPrivacyPolicyArValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);

	useEffect(() => {
		const getGenerals = async () => {
			const result = await Axios.get(Api.generals);
			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					if (result.data.data && result.data.data.PRIVACY_POLICY_EN) {
						setPrivacyPolicyEn(result.data.data.PRIVACY_POLICY_EN);
						setPrivacyPolicyEnValue(result.data.data.PRIVACY_POLICY_EN.value);
					}

					if (result.data.data && result.data.data.PRIVACY_POLICY_AR) {
						setPrivacyPolicyAr(result.data.data.PRIVACY_POLICY_AR);
						setPrivacyPolicyArValue(result.data.data.PRIVACY_POLICY_AR.value);
					}
				} else {
					// setError(true);
					// setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getGenerals();
	}, [props.user.token, t]);

	const updatePrivacyPolicyEn = async () => {
		setValidationError('')
		try {
			const data = {
				value: privacyPolicyEnValue,
			};
			await Joi.generator(
				{
					value: commonChains.stringRequired,
				},
				data
			);
			setLoading(true);
			const result = await Axios.patch({
				url: Api.updateGeneral + `/${privacyPolicyEn._id}`,
				data,
				accessToken: props.user.token,
			});
			setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 200) {
					setPrivacyPolicyEn(result.data.general);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
		} catch (error) {
			if (error.name === 'ValidationError') {
				setValidationError('privacyEnValidationError');
				setError({ inError: true, errorMessage: t('privacyEnValidationError') });
			} else {
				console.log(error);
				setError({ inError: true, errorMessage: t('somethingWrongError') });
			}
		}
	};

	const updatePrivacyPolicyAr = async () => {
		setValidationError('')
		try {
			const data = {
				value: privacyPolicyArValue,
			};
			await Joi.generator(
				{
					value: commonChains.stringRequired,
				},
				data
			);
			setLoading(true);
			const result = await Axios.patch({
				url: Api.updateGeneral + `/${privacyPolicyAr._id}`,
				data,
				accessToken: props.user.token,
			});
			setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 200) {
					setPrivacyPolicyAr(result.data.general);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
		} catch (error) {
			if (error.name === 'ValidationError') {
				setValidationError('privacyArValidationError');
				setError({ inError: true, errorMessage: t('privacyArValidationError') });
			} else {
				console.log(error);
				setError({ inError: true, errorMessage: t('somethingWrongError') });
			}
		}
	};

	const handlePrivacyPolicyEnChange = (event) => {
		setPrivacyPolicyEnValue(event.target.value);
	};

	const handlePrivacyPolicyArChange = (event) => {
		setPrivacyPolicyArValue(event.target.value);
	};

	const navigate = useNavigate();
	const handleClick = (event) => {
		event.preventDefault();

		navigate('/dashboard/');
	};

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('privacyPolicy')}</Typography>
			</Breadcrumbs>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={12} md={6} key={'ar'}>
					<Card sx={{ marginTop: '1rem' }}>
						<CardContent>
							<TextField
								error={validationError==='privacyEnValidationError'}
								label={t('privacyPolicyEn')}
								multiline
								rows={10}
								variant="outlined"
								fullWidth
								value={privacyPolicyEnValue}
								onChange={handlePrivacyPolicyEnChange}
								InputProps={{
									dir: 'ltr',
								}}
							/>
							<CardActions>
								<Button variant="contained" color="primary" onClick={updatePrivacyPolicyEn}>
									{t('save')}
								</Button>
							</CardActions>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={12} md={6} key={'en'}>
					<Card sx={{ marginTop: '1rem' }}>
						<CardContent>
							<TextField
								error={validationError==='privacyArValidationError'}
								label={t('privacyPolicyAr')}
								multiline
								rows={10}
								variant="outlined"
								fullWidth
								value={privacyPolicyArValue}
								onChange={handlePrivacyPolicyArChange}
								InputProps={{
									dir: 'rtl',
								}}
							/>
							<CardActions>
								<Button variant="contained" color="primary" onClick={updatePrivacyPolicyAr}>
									{t('save')}
								</Button>
							</CardActions>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default PrivacyPolicyEditor;
