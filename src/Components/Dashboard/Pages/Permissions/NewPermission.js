import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Dialog from '../../../UI/Dialog';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ErrorContext from '../../../../ErrorContext';
const NewPermission = (props) => {
	const { t } = useTranslation();
	const [newPermissionId, setNewPermissionId] = useState('');
	const [newPermissionNameAr, setNewPermissionNameAr] = useState('');
	const [newPermissionNameEn, setNewPermissionNameEn] = useState('');
	const [newPermissionRoles, setNewPermissionRoles] = useState({ 4: true });
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);
	useEffect(() => {
		if (props.update && props.updatedPermission) {
			setNewPermissionId(props.updatedPermission._id);
			setNewPermissionNameAr(props.updatedPermission.nameAr);
			setNewPermissionNameEn(props.updatedPermission.nameEn);
			setNewPermissionRoles(props.updatedPermission.roles);
		} else {
			setNewPermissionId('');
			setNewPermissionNameAr('');
			setNewPermissionNameEn('');
			setNewPermissionRoles({ 4: true });
		}
	}, [props.update, props.updatedPermission]);

	const onRoleCheck = (roleId, isChecked) => {
		setNewPermissionRoles({ ...newPermissionRoles, [roleId]: isChecked });
	};
	const addPermission = async () => {
		try {
			const newRoles = [];
			for (const roleId in newPermissionRoles) {
				if (newPermissionRoles[roleId]) newRoles.push(parseInt(roleId));
			}
			const data = {
				_id: newPermissionId,
				nameAr: newPermissionNameAr,
				nameEn: newPermissionNameEn,
				roles: newRoles,
			};

			await Joi.generator(
				{
					_id: commonChains.stringRequired,
					nameAr: commonChains.stringRequired,
					nameEn: commonChains.stringRequired,
					roles: commonChains.arrayRequired,
				},
				data
			);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.post({
				url: Api.createPermission,
				data,
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 201) {
					const newPermissions = {
						...props.permissions,
						[result.data.permission._id]: {
							nameAr: result.data.permission.nameAr,
							nameEn: result.data.permission.nameEn,
							// roles: props.roles.filter((role) => {
							// 	if (newRoles.includes(role._id)) return role;
							// }),
							roles: props.roles.filter((role) => role && newRoles.includes(role._id)),
						},
					};
					props.setPermissions(newPermissions);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}

			setNewPermissionId('');
			setNewPermissionNameAr('');
			setNewPermissionNameEn('');
			setNewPermissionRoles({ 4: true });
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

	const updatePermission = async () => {
		try {
			const newRoles = [];
			for (const roleId in newPermissionRoles) {
				if (newPermissionRoles[roleId]) newRoles.push(parseInt(roleId));
			}
			const data = {
				nameAr: newPermissionNameAr,
				nameEn: newPermissionNameEn,
				roles: newRoles,
			};
			await Joi.generator(
				{
					nameAr: commonChains.stringOptional,
					nameEn: commonChains.stringOptional,
					roles: commonChains.arrayOptional,
				},
				data
			);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.patch({
				url: Api.updatePermission + `/${newPermissionId}`,
				data,
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 200) {
					const newPermissions = {
						...props.permissions,
						[result.data.general._id]: {
							nameAr: result.data.general.nameAr,
							nameEn: result.data.general.nameEn,
							// roles: props.roles.filter((role) => {
							// 	if (newRoles.includes(role._id)) return role;
							// }),
							roles: props.roles.filter((role) => role && newRoles.includes(role._id)),
						},
					};

					props.setPermissions(newPermissions);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('validationError') });
				}
			}

			setNewPermissionId('');
			setNewPermissionNameAr('');
			setNewPermissionNameEn('');
			setNewPermissionRoles({ 4: true });
			props.setUpdatedPermission({});
			props.setUpdate(false);
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

	const newPermissionIdChangedHandler = (event) => {
		setNewPermissionId(event.target.value);
	};

	const newPermissionNameArChangedHandler = (event) => {
		setNewPermissionNameAr(event.target.value);
	};

	const newPermissionNameEnChangedHandler = (event) => {
		setNewPermissionNameEn(event.target.value);
	};

	return (
		<Dialog
			open={props.open}
			setOpen={props.setOpen}
			title={t(props.update ? 'updatePermissionTitle' : 'addPermissionTitle')}
			description={t('addPermissionDescription')}
			onOk={props.update ? updatePermission : addPermission}
			onClose={() => {
				setValidationError('');
				props.setUpdate(false);
				props.setUpdatedPermission({});
			}}
		>
			<TextField
				disabled={props.update}
				placeholder={'PERMISSION_ID'}
				autoFocus
				margin="dense"
				id="_id"
				label={t('id')}
				type="text"
				fullWidth
				variant="standard"
				value={newPermissionId}
				onChange={newPermissionIdChangedHandler}
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
				value={newPermissionNameAr}
				onChange={newPermissionNameArChangedHandler}
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
				value={newPermissionNameEn}
				onChange={newPermissionNameEnChangedHandler}
				error={validationError === 'nameEn'}
			/>
			<FormGroup
				sx={{
					display: 'grid',
					gridGap: '10px',
					gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(auto-fit, minmax(0, 1fr))' },
				}}
			>
				{props.roles.map((role) => {
					return (
						<FormControlLabel
							key={role._id}
							disabled={role._id === 4}
							checked={newPermissionRoles ? newPermissionRoles[role._id] : false}
							control={
								<Checkbox
									onChange={(event) => {
										event.preventDefault();
										onRoleCheck(role._id, event.target.checked);
									}}
								/>
							}
							label={role[t('name')]}
						/>
					);
				})}
			</FormGroup>
		</Dialog>
	);
};

export default NewPermission;
