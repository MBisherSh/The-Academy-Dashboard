import classes from './Profits.module.css';
import Title from '../../../UI/Title';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import Snackbar from '../../../UI/Snackbar';

const Profits = (props) => {
	const [allTimeProfits, setAllTimeProfits] = useState(0);
	const [sixMonthsAgoProfits, setSixMonthsAgoProfits] = useState([]);
	const [error, setError] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const { t } = useTranslation();

	useEffect(() => {
		const getPaymentsStatistics = async () => {
			const result = await Axios.get(Api.paymentsStatistics, props.user.token);
			if (result.error) {
				console.log(result.error);
				setError(true);
				setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					result.data.allTimeProfits.forEach((p) => {
						if (p._id === 'deposit') setAllTimeProfits(p.totalAmount);
					});
					let arr = result.data.sixMonthsAgoProfits.sort((a, b) => a.month - b.month);
					arr = arr.map((p) => {
						return { month: t(p.month), total: p.total };
					});
					setSixMonthsAgoProfits(arr);
				} else {
					setError(true);
					setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getPaymentsStatistics();
	}, [props.user.token, t, props.refreshData]);

	return (
		<Fragment>
			<Title>{t('profits')}</Title>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<Typography color="text.secondary" variant="p" component="div">
						{t('allTimeProfits')}
					</Typography>
					<Typography sx={{ fontWeight: '600' }} variant="h5" component="div">
						{allTimeProfits.toLocaleString(t('locales'), {
							style: 'currency',
							currency:'SYP'
						})}
					</Typography>
				</div>
				<BarChart
					width={400}
					height={200}
					data={sixMonthsAgoProfits}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis 	className={classes.ltr} />
					<Tooltip />
					<Legend />
					<Bar name={t('total')} dataKey="total" fill="#8884d8" />
				</BarChart>
			</Box>
			<Snackbar open={error} setOpen={setError} errorMessage={errorMessage} severity={'error'} />
		</Fragment>
	);
};

export default Profits;
