import React, { Fragment, useEffect, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '../../../UI/Dialog';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import { Pagination } from '@mui/material';
import ErrorContext from '../../../../ErrorContext';

const PAGE_SIZE = 50;
const NewTransaction = (props) => {
	const [newTransactionOpen, setNewTransactionOpen] = useState(false);
	const [amount, setAmount] = useState('');
	const [type, setType] = useState('deposit');
	const [user, setUser] = useState('');
	const [users, setUsers] = useState([]);
	const [usersCount, setUsersCount] = useState([]);
	const [page, setPage] = useState(1);
	const [details, setDetails] = useState('');
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);

	const { t, i18n } = useTranslation();
	const handleClickNewTransactionOpen = () => {
		setNewTransactionOpen(true);
	};
	const amountChangedHandler = (event) => {
		setAmount(event.target.value);
	};
	const detailsChangedHandler = (event) => {
		setDetails(event.target.value);
	};
	const typeChangedHandler = (event) => {
		setType(event.target.value);
	};
	const userChangedHandler = (event) => {
		setUser(event.target.value);
	};

	useEffect(() => {
		const getUsers = async () => {
			const result = await Axios.get(Api.users, props.user.token, {
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setUsers(result.data.data);
					if (result.data.total) setUsersCount(result.data.total);
				}
			}
		};
		getUsers();
	}, [page, props.user.token, t]);

	const newTransaction = async () => {
		try {
			const data = {
				amount,
				type,
				details,
				userId: user._id,
			};
			await Joi.generator(
				{
					amount: commonChains.amountRequired,
					type: commonChains.stringRequired,
					details: commonChains.stringRequired,
					userId: commonChains.stringRequired,
				},
				data
			);
			props.setLoading(true);
			setNewTransactionOpen(false);
			const result = await Axios.post({
				url: Api.createTransaction,
				data,
				accessToken: props.user.token,
			});

			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 201) {
					props.setTransactions((transactions) => [{ ...result.data.transaction, user }, ...transactions]);
					setAmount('');
					setUser('');
					setDetails('');
					setValidationError('');
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
			props.setLoading(false);
		} catch (error) {
			if (error.name === 'ValidationError') {
				const key = error.details[0]?.context.key;
				setValidationError(key);
				setError({ inError: true, errorMessage: t(key + 'ValidationError') });
			} else {
				console.log(error);
				setError({ inError: true, errorMessage: t('somethingWrongError') });
			}
		}
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	return (
		<Fragment>
			<Button
				variant="outlined"
				onClick={handleClickNewTransactionOpen}
				sx={i18n.dir() === 'ltr' ? { marginRight: '1rem' } : { marginLeft: '1rem' }}
			>
				{t('newTransactionTitle')}
			</Button>
			<Dialog
				open={newTransactionOpen}
				setOpen={setNewTransactionOpen}
				title={t('newTransactionTitle')}
				description={t('newTransactionDescription')}
				onOk={newTransaction}
			>
				<Box sx={{ minWidth: 130, display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
					<TextField
						InputProps={{
							dir: 'ltr',
						}}
						autoFocus
						margin="dense"
						id="amount"
						label={t('enterAmount')}
						type="number"
						fullWidth
						placeholder={'>1000'}
						variant="standard"
						value={amount}
						onChange={amountChangedHandler}
						error={validationError === 'amount'}
					/>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">{t('type')}</InputLabel>
						<Select
							error={validationError === 'type'}
							labelId="type-select-label"
							id="type-select"
							value={type}
							label={t('type')}
							onChange={typeChangedHandler}
						>
							<MenuItem value={'deposit'}>{t('deposit')}</MenuItem>
							<MenuItem value={'fee'}>{t('fee')}</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<TextField
					autoFocus
					margin="dense"
					id="details"
					error={validationError === 'details'}
					label={t('details')}
					type="text"
					fullWidth
					variant="standard"
					value={details}
					onChange={detailsChangedHandler}
				/>
				<FormControl fullWidth sx={{ marginTop: '1rem' }}>
					<InputLabel id="user-select-label">{t('user')}</InputLabel>
					<Select
						error={validationError === 'userId'}
						labelId="user-select-label"
						label={t('user')}
						value={user}
						onChange={userChangedHandler}
					>
						{users.map((user) => (
							<MenuItem key={user._id} value={user}>
								{user.name}
							</MenuItem>
						))}
					</Select>
					{usersCount > PAGE_SIZE && (
						<Pagination
							sx={{ marginTop: '0.5rem', direction: 'ltr' }}
							count={Math.ceil(usersCount / PAGE_SIZE)}
							color="primary"
							page={page}
							onChange={handlePageChange}
						/>
					)}
				</FormControl>
			</Dialog>
		</Fragment>
	);
};
export default NewTransaction;
