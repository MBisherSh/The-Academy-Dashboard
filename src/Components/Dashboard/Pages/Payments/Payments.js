import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import classes from './Payments.module.css';
import Card from '@mui/material/Card';
import { Breadcrumbs, Link, Typography, CircularProgress, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Title from '../../../UI/Title';
import CardContent from '@mui/material/CardContent';
import Profits from './Profits';
import Prices from './Prices';
import EditPrices from './EditPrices';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import NewTransaction from './NewTransaction';
import restrictToPermission from '../../../../Utils/restrictToPermission';
import NotAllowed from '../../../UI/NotAllowed';
import PermissionsContext from '../../../../PermissionsContext';

const Payments = (props) => {
	const { permissions } = React.useContext(PermissionsContext);
	const [coachFee, setCoachFee] = useState({ value: 0 });
	const [courseFee, setCourseFee] = useState({ value: 0 });
	const [loading, setLoading] = React.useState(false);
	const [refreshData, setRefreshData] = React.useState(0);
	const [transactions, setTransactions] = React.useState([]);
	const [totalTransactions, setTotalTransactions] = React.useState(0);
	const [paginationModel, setPaginationModel] = React.useState({
		page: 0,
		pageSize: 5,
	});
	const [gridLoading, setGridLoading] = React.useState(false);

	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const localization = {
		MuiTablePagination: {
			labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} ${t('of')}  ${count}`,
		},
	};
	const handleClick = (event) => {
		event.preventDefault();
		navigate('/dashboard/');
	};
	const columns = [
		{ field: '_id', headerName: t('id'), width: 150, sortable: false },
		{
			field: 'user',
			headerName: t('fullName'),
			width: 130,
			valueGetter: (params) => {
				return params.value.name;
			},
			sortable: false,
		},
		{
			field: 'type',
			headerName: t('type'),
			width: 70,
			renderCell: (params) => <Typography variant={'p'}>{t(params.value)}</Typography>,
			sortable: false,
		},
		{
			field: 'amount',
			headerName: t('amount'),
			type: 'number',
			width: 90,
			sortable: false,
		},
		{ field: 'details', headerName: t('details'), width: 200, sortable: false },
		{
			field: 'createdAt',
			headerName: t('createdAt'),
			width: 225,
			sortable: false,
			renderCell: (params) => {
				const date = new Date(params.value);
				return date.toLocaleString(i18n.language, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					weekday: 'long',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric',
				});
			},
		},
	];
	useEffect(() => {
		const getTransactions = async () => {
			setGridLoading(true);
			const result = await Axios.get(Api.transactions, props.user.token, {
				limit: 5,
				offset: paginationModel.page * 5,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setTransactions(result.data.data);
					if (result.data.total) setTotalTransactions(result.data.total);
				} else {
					// setError(true);
					// setErrorMessage(t('somethingWrongError'));
				}
			}
			setGridLoading(false);
		};
		getTransactions();
	}, [paginationModel, props.user.token, t, refreshData]);
	const refresh = () => {
		setRefreshData((data) => data + 1);
	};

	if (restrictToPermission('PAYMENTS', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('transactions')}</Typography>
			</Breadcrumbs>
			<Box sx={{ display: 'flex', justifyContent: 'start', marginTop: '1rem' }}>
				<NewTransaction
					setTransactions={setTransactions}
					user={props.user}
					loading={loading}
					setLoading={setLoading}
					refresh={refresh}
				/>
				<EditPrices
					coachFee={coachFee}
					setCoachFee={setCoachFee}
					courseFee={courseFee}
					setCourseFee={setCourseFee}
					user={props.user}
					loading={loading}
					setLoading={setLoading}
				/>
			</Box>
			<div className={classes.horizon}>
				<Card className={classes.chartsItem + ' ' + classes.profits}>
					<CardContent>
						<Profits user={props.user} refreshData={refreshData} />
					</CardContent>
				</Card>
				<Card className={classes.chartsItem + ' ' + classes.prices}>
					<CardContent>
						<Prices
							user={props.user}
							coachFee={coachFee}
							setCoachFee={setCoachFee}
							courseFee={courseFee}
							setCourseFee={setCourseFee}
						/>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardContent>
					<Title>{t('transactions')}</Title>
					<DataGrid
						disableColumnMenu
						disableColumnFilter
						className={classes.table}
						rows={transactions}
						rowCount={totalTransactions}
						columns={columns}
						pageSizeOptions={[5]}
						getRowId={(row) => row._id}
						paginationMode={'server'}
						paginationModel={paginationModel}
						onPaginationModelChange={setPaginationModel}
						loading={gridLoading}
						localeText={localization}
						sx={{
							'& .MuiTablePagination-actions': {
								direction: 'ltr',
							},
						}}
					/>
				</CardContent>
			</Card>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default Payments;
