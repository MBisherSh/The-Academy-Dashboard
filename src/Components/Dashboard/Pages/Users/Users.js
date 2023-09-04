import React, { useState, useEffect } from 'react';
import classes from './Users.module.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Card, Avatar, CircularProgress, Backdrop } from '@mui/material';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Title from '../../../UI/Title';
import { DataGrid } from '@mui/x-data-grid';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import EditUserRole from './EditUserRole';
import restrictToPermission from '../../../../Utils/restrictToPermission';
import NotAllowed from '../../../UI/NotAllowed';
import PermissionsContext from '../../../../PermissionsContext';

const Users = (props) => {
	const { permissions } = React.useContext(PermissionsContext);
	const [users, setUsers] = useState([]);
	const [totalUsers, setTotalUsers] = React.useState(0);
	const [roles, setRoles] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [paginationModel, setPaginationModel] = React.useState({
		page: 0,
		pageSize: 5,
	});
	const [gridLoading, setGridLoading] = React.useState(false);
	const [updateUserRoleOpen, setUpdateUserRoleOpen] = React.useState(false);
	const [updatedUser, setUpdatedUser] = React.useState({});
	const { t } = useTranslation();
	const localization = {
		MuiTablePagination: {
			labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} ${t('of')}  ${count}`,
		},
	};

	useEffect(() => {
		const getUsers = async () => {
			setGridLoading(true);
			const result = await Axios.get(Api.users, props.user.token, {
				limit: 5,
				offset: paginationModel.page * 5,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setUsers(result.data.data);
					if (result.data.total) setTotalUsers(result.data.total);
				} else {
					// setError(true);
					// setErrorMessage(t('somethingWrongError'));
				}
			}
			setGridLoading(false);
		};
		getUsers();
	}, [paginationModel, props.user.token, t]);

	useEffect(() => {
		const getRoles = async () => {
			const result = await Axios.get(Api.roles);
			if (result.error) {
				console.log(result.error);
				//setError(true);
				//setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setRoles(result.data.data.sort((a, b) => a._id - b._id));
				} else {
					console.log(result.error);
					//setError(true);
					//setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getRoles();
	}, [t]);

	const editRole = (user) => {
		setUpdatedUser(user);
		setUpdateUserRoleOpen(true);
	};

	const getRole = (roleId) => {
		const r = roles.find((role) => role._id === roleId);
		if (r) return r[t('name')];
		else return roleId;
	};

	const columns = [
		{ field: '_id', headerName: t('id'), width: 250, sortable: false },
		{
			field: 'profileImage',
			headerName: t('profileImage'),
			width: 150,
			renderCell: (params) => (
				<Avatar
					src={
						params.value
							? 'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' + params.value
							: ''
					}
					alt={params.row.name}
				/>
			),
		},
		{
			field: 'name',
			headerName: t('fullName'),
			width: 150,
			sortable: false,
		},

		{ field: 'email', headerName: t('email'), width: 200, sortable: false },
		{
			field: 'role',
			headerName: t('role'),
			type: 'number',
			width: 150,
			sortable: false,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Typography>{getRole(params.value)}</Typography>
						<Tooltip title={t('edit')}>
							<IconButton
								onClick={(event) => {
									event.preventDefault();
									editRole(params.row);
								}}
							>
								<EditIcon />
							</IconButton>
						</Tooltip>
					</Box>
				);
			},
		},
	];

	const navigate = useNavigate();
	const handleClick = (event) => {
		event.preventDefault();

		navigate('/dashboard/');
	};

	if (restrictToPermission('RBAC', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('users')}</Typography>
			</Breadcrumbs>
			<Card sx={{ marginTop: '1rem' }}>
				<CardContent>
					<Title>{t('allUsers')}</Title>
					<DataGrid
						disableColumnMenu
						disableColumnFilter
						className={classes.table}
						rows={users}
						rowCount={totalUsers}
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
			<EditUserRole
				user={props.user}
				roles={roles}
				updatedUser={updatedUser}
				open={updateUserRoleOpen}
				setOpen={setUpdateUserRoleOpen}
				setLoading={setLoading}
				users={users}
				setUsers={setUsers}
			/>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default Users;
