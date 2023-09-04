import React from 'react';
import { Box } from '@mui/material';
import welcomeImage from '../../assets/welcome.png';
import classes from './Welcome.module.css';
import { useTranslation } from 'react-i18next';
const Welcome = () => {
	const { t, i18n } = useTranslation();
	return (
		<Box
			component={'div'}
			className={classes.welcome}
			sx={i18n.dir() === 'ltr' ? { borderRadius: '12px 0 0 12px' } : { borderRadius: '0 12px 12px 0' }}
		>
			<img src={welcomeImage} className={classes.welcomeItem} alt={'welcome'} />
			<h2 className={classes.welcomeText}> {t('welcome')}</h2>
		</Box>
	);
};

export default Welcome;
