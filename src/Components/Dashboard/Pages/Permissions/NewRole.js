import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Dialog from '../../../UI/Dialog';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import ErrorContext from '../../../../ErrorContext';

const NewRole = (props) => {
	const { t } = useTranslation();
	const [newRoleId, setNewRoleId] = useState(null);
	const [newRoleNameAr, setNewRoleNameAr] = useState('');
	const [newRoleNameEn, setNewRoleNameEn] = useState('');
	const [validationError, setValidationError] = useState('');
	const {  setError } = useContext(ErrorContext);
	const addRole = async () => {
		try {
			const data = {
				_id: newRoleId,
				nameAr: newRoleNameAr,
				nameEn: newRoleNameEn,
			};
			await Joi.generator(
				{
					_id: commonChains.numberRequired,
					nameAr: commonChains.stringRequired,
					nameEn: commonChains.stringRequired,
				},
				data
			);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.post({
				url: Api.createRole,
				data,
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 201) {
					const newRoles = [result.data.role, ...props.roles];
					props.setRoles(newRoles.sort((a, b) => a._id - b._id));
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}

			setNewRoleId(null);
			setNewRoleNameAr('');
			setNewRoleNameEn('');
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

	const newRoleIdChangedHandler = (event) => {
		setNewRoleId(event.target.value);
	};

	const newRoleNameArChangedHandler = (event) => {
		setNewRoleNameAr(event.target.value);
	};

	const newRoleNameEnChangedHandler = (event) => {
		setNewRoleNameEn(event.target.value);
	};

	return (
		<Dialog
			open={props.open}
			setOpen={props.setOpen}
			title={t('addRoleTitle')}
			description={t('addRoleDescription')}
			onOk={addRole}
		>
			<TextField
				autoFocus
				margin="dense"
				id="_id"
				label={t('id')}
				type="number"
				fullWidth
				variant="standard"
				value={newRoleId}
				onChange={newRoleIdChangedHandler}
				error={validationError === '_id'}
			/>
			<TextField
				autoFocus
				margin="dense"
				id="nameAr"
				label={t('nameAr')}
				type="text"
				fullWidth
				variant="standard"
				value={newRoleNameAr}
				onChange={newRoleNameArChangedHandler}
				error={validationError === 'nameAr'}
			/>
			<TextField
				autoFocus
				margin="dense"
				id="nameEn"
				label={t('nameEn')}
				type="text"
				fullWidth
				variant="standard"
				value={newRoleNameEn}
				onChange={newRoleNameEnChangedHandler}
				error={validationError === 'nameEn'}
			/>
		</Dialog>
	);
};

export default NewRole;
