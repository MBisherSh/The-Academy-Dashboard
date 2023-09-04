import Title from '../../../UI/Title';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import { Divider } from '@mui/material';

const Profits = (props) => {
	const { t } = useTranslation();

	const { setCoachFee, setCourseFee } = props;
	useEffect(() => {
		const getPaymentsStatistics = async () => {
			const result = await Axios.get(Api.generals);
			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					if (result.data.data && result.data.data.COACH_SUBSCRIPTION_FEE)
						setCoachFee(result.data.data.COACH_SUBSCRIPTION_FEE);
					if (result.data.data && result.data.data.PRIVATE_COURSE_FEE)
						setCourseFee(result.data.data.PRIVATE_COURSE_FEE);
				} else {
					// setError(true);
					// setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getPaymentsStatistics();
	}, [setCourseFee, setCoachFee, props.user.token, t]);

	return (
		<Fragment>
			<Title>{t('prices')}</Title>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1rem',
					marginTop: '1rem',
				}}
			>
				<Typography variant="p" component="p">
					{t('coachSubscriptionFee')}
				</Typography>
				<Typography sx={{ fontWeight: '600' }} variant="h5" component="p">
					{parseInt(props.coachFee.value)?.toLocaleString(t('locales'), {
						style: 'currency',
						currency: 'SYP',
					})}
				</Typography>
			</Box>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: '1rem',
					marginBottom: '1rem',
				}}
			>
				<Typography variant="p" component="p">
					{t('privateCourseFee')}
				</Typography>
				<Typography sx={{ fontWeight: '600' }} variant="h5" component="p">
					{parseInt(props.courseFee.value)?.toLocaleString(t('locales'), {
						style: 'currency',
						currency: 'SYP',
					})}
				</Typography>
			</Box>
			<Divider />
		</Fragment>
	);
};

export default Profits;
