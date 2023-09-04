import { Container } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotAllowed = () => {
	const { t } = useTranslation();

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '80vh',
			}}
		>
			{t('notAllowed')}
		</Container>
	);
};

export default NotAllowed;
