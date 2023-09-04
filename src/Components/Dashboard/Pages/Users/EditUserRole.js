import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../../../UI/Dialog';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Avatar } from '@mui/material';
import classes from '../../../Layout/ResponsiveDrawer.module.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const EditUserRole = (props) => {
	const { t } = useTranslation();
	const [editedUserRoleId, setEditedUserRoleId] = useState(0);

	useEffect(() => {
		if (props.updatedUser) {
			setEditedUserRoleId(props.updatedUser.role);
		}
	}, [props.updatedUser]);

	const updateUserRole = async () => {
		try {
			const data = {
				id: props.updatedUser._id,
				role: editedUserRoleId,
			};
			await Joi.generator(
				{
					id: commonChains.stringRequired,
					role: commonChains.numberRequired,
				},
				data
			);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.patch({
				url: Api.updateUserRole,
				data,
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (result.status === 200) {
				props.setUsers((lastUsers) => {
					return lastUsers.map((u) => {
						if (u._id === props.updatedUser._id) return { ...u, role: editedUserRoleId };
						else return u;
					});
				});
			} else {
			}
			setEditedUserRoleId(0);
		} catch (error) {}
	};

	const editedUserRoleIdChangedHandler = (event) => {
		setEditedUserRoleId(event.target.value);
	};

	return (
		<Dialog
			open={props.open}
			setOpen={props.setOpen}
			title={t('updateUserRoleTitle')}
			description={t('updateUserRoleDescription')}
			onOk={updateUserRole}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
				<Avatar
					className={classes.avatar}
					alt={props.updatedUser.name}
					src={
						'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' + props.updatedUser.profileImage
					}
				/>
				<Typography variant="h6">{props.updatedUser.name}</Typography>
			</Box>

			<FormControl fullWidth sx={{ marginTop: '1rem' }}>
				<InputLabel id="role-select-label">{t('role')}</InputLabel>
				<Select
					labelId="type-select-label"
					id="type-select"
					value={editedUserRoleId}
					label={t('role')}
					onChange={editedUserRoleIdChangedHandler}
				>
					{props.roles.map((role) => (
						<MenuItem key={role._id} value={role._id}>
							{role[t('name')]}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Dialog>
	);
};

export default EditUserRole;
