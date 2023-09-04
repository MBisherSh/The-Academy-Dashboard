import classes from './Permissions.module.css';
import { Breadcrumbs, Link, Typography, Card, CircularProgress, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PermissionsTable from './PermissionsTable';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import Snackbar from '../../../UI/Snackbar';
import NewRole from './NewRole';
import NewPermission from './NewPermission';
import ConfirmDialog from '../../../UI/ConfirmDialog';
import Button from '@mui/material/Button';
import PermissionsContext from '../../../../PermissionsContext';
import restrictToPermission from '../../../../Utils/restrictToPermission';
import NotAllowed from '../../../UI/NotAllowed';
const Permissions = (props) => {
	const { permissions, setPermissions } = React.useContext(PermissionsContext);
	const [roles, setRoles] = React.useState([]);
	const [error, setError] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const [deletedRoleId, setDeletedRoleId] = React.useState(-1);
	const [deletedPermissionId, setDeletedPermissionId] = React.useState(-1);
	const [inConfirm, setInConfirm] = React.useState(false);
	const [confirmItem, setConfirmItem] = React.useState(<div></div>);
	const [inPermissionConfirm, setInPermissionConfirm] = React.useState(false);
	const [confirmPermissionItem, setConfirmPermissionItem] = React.useState(<div></div>);
	const [addRoleOpen, setAddRoleOpen] = React.useState(false);
	const [addPermissionOpen, setAddPermissionOpen] = React.useState(false);
	const [updatePermissionOpen, setUpdatePermissionOpen] = React.useState(false);
	const [updatedPermission, setUpdatedPermission] = React.useState({});
	const [inDefaultConfirm, setInDefaultConfirm] = React.useState(false);
	const [confirmDefaultItem, setConfirmDefaultItem] = React.useState(<div></div>);

	const handleClickAddRoleOpen = () => {
		setAddRoleOpen(true);
	};

	const handleClickAddPermissionOpen = () => {
		setAddPermissionOpen(true);
	};

	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const handleClick = (event) => {
		event.preventDefault();
		navigate('/dashboard/');
	};
	const deleteRole = async () => {
		try {
			const result = await Axios.delete({
				url: Api.deleteRole + `/${deletedRoleId}`,
				accessToken: props.user.token,
			});

			if (result.status === 204) {
				const newRoles = roles.filter((item) => item._id !== deletedRoleId);
				setRoles(newRoles);
			} else {
			}
		} catch (error) {}
	};

	const deletePermission = async () => {
		try {
			const result = await Axios.delete({
				url: Api.deletePermission + `/${deletedPermissionId}`,
				accessToken: props.user.token,
			});

			if (result.status === 204) {
				const { [deletedPermissionId]: deleted, ...newPermissions } = permissions;
				setPermissions(newPermissions);
			} else {
			}
		} catch (error) {}
	};

	const setDefault = async () => {
		try {
			const resultDefaultRoles = await Axios.patch({
				url: Api.setDefaultRoles,
				accessToken: props.user.token,
			});

			const resultDefaultPermissions = await Axios.patch({
				url: Api.setDefaultPermissions,
				accessToken: props.user.token,
			});

			if (resultDefaultRoles.status === 200 && resultDefaultPermissions.status === 200) {
				window.location.reload();
			} else {
				setError(true);
				setErrorMessage(t('somethingWrongError'));
			}
		} catch (error) {
			console.log(error);
			setError(true);
			setErrorMessage(t('somethingWrongError'));
		}
	};

	const handleDeleteRole = (roleId) => {
		setDeletedRoleId(roleId);
		setConfirmItem(<Typography variant={'p'}>{t('roleItem') + roleId}</Typography>);
		setInConfirm(true);
	};

	const handleDeletePermissions = (permissionId) => {
		setDeletedPermissionId(permissionId);
		setConfirmPermissionItem(<Typography variant={'p'}>{t('permissionItem') + permissionId}</Typography>);
		setInPermissionConfirm(true);
	};

	const handleSetDefault = () => {
		setConfirmDefaultItem(<Typography variant={'p'}>{t('setDefaultItem')}</Typography>);
		setInDefaultConfirm(true);
	};

	const handleEditPermission = (permissionId) => {
		const permission = { ...permissions[permissionId] };
		permission._id = permissionId;
		const roles = {};
		permission.roles.forEach((role) => {
			roles[role._id] = true;
		});
		permission.roles = roles;
		setUpdatedPermission(permission);
		setUpdatePermissionOpen(true);
	};

	// useEffect(() => {
	// 	const getPermissions = async () => {
	// 		const result = await Axios.get(Api.permissions);
	// 		if (result.error) {
	// 			console.log(result.error);
	// 			setError(true);
	// 			setErrorMessage(t('connectionError'));
	// 		} else {
	// 			if (result.status === 200) {
	// 				setPermissions(result.data.data);
	// 			} else {
	// 				console.log(result.error);
	// 				setError(true);
	// 				setErrorMessage(t('somethingWrongError'));
	// 			}
	// 		}
	// 	};
	// 	getPermissions();
	// }, [t]);

	useEffect(() => {
		const getRoles = async () => {
			const result = await Axios.get(Api.roles);
			if (result.error) {
				console.log(result.error);
				setError(true);
				setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setRoles(result.data.data.sort((a, b) => a._id - b._id));
				} else {
					console.log(result.error);
					setError(true);
					setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getRoles();
	}, [t]);

	// if (props?.generalPermissions?.RBAC?.roles.find((r) => r._id === props.user.user.role)) console.log('hi');
	// else console.log('bye')
	// return <Box>{t('notAllowed')}</Box>;

	if (restrictToPermission('RBAC', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('accessControl')}</Typography>
			</Breadcrumbs>
			<Box sx={{ display: 'flex', justifyContent: 'start', marginTop: '1rem' }}>
				<Button
					variant="outlined"
					onClick={handleClickAddRoleOpen}
					sx={i18n.dir() === 'ltr' ? { marginRight: '1rem' } : { marginLeft: '1rem' }}
				>
					{t('addRoleTitle')}
				</Button>
				<NewRole
					open={addRoleOpen}
					setOpen={setAddRoleOpen}
					setLoading={setLoading}
					roles={roles}
					setRoles={setRoles}
					user={props.user}
				/>
				<Button
					variant="outlined"
					onClick={handleClickAddPermissionOpen}
					sx={i18n.dir() === 'ltr' ? { marginRight: '1rem' } : { marginLeft: '1rem' }}
				>
					{t('addPermissionTitle')}
				</Button>
				<NewPermission
					open={addPermissionOpen || updatePermissionOpen}
					setOpen={setAddPermissionOpen}
					setLoading={setLoading}
					roles={roles}
					permissions={permissions}
					setPermissions={setPermissions}
					user={props.user}
					update={updatePermissionOpen}
					setUpdate={setUpdatePermissionOpen}
					updatedPermission={updatedPermission}
					setUpdatedPermission={setUpdatedPermission}
				/>
				<Button variant="outlined" onClick={handleSetDefault}>
					{t('setDefaultTitle')}
				</Button>
			</Box>
			<Card className={classes.access}>
				<PermissionsTable
					handleDeleteRole={handleDeleteRole}
					handleDeletePermission={handleDeletePermissions}
					handleEditPermission={handleEditPermission}
					permissions={permissions}
					roles={roles}
					user={props.user}
					className={classes.table}
				/>
			</Card>
			<Snackbar open={error} setOpen={setError} errorMessage={errorMessage} severity={'error'} />
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<ConfirmDialog
				setLoading={setLoading}
				open={inConfirm}
				setOpen={setInConfirm}
				onOk={deleteRole}
				title={t('deleteConfirm')}
				description={t('deleteDescription')}
			>
				{confirmItem}
			</ConfirmDialog>
			<ConfirmDialog
				setLoading={setLoading}
				open={inPermissionConfirm}
				setOpen={setInPermissionConfirm}
				onOk={deletePermission}
				title={t('deleteConfirm')}
				description={t('deleteDescription')}
			>
				{confirmPermissionItem}
			</ConfirmDialog>
			<ConfirmDialog
				setLoading={setLoading}
				open={inDefaultConfirm}
				setOpen={setInDefaultConfirm}
				onOk={setDefault}
				title={t('setDefaultConfirm')}
				description={t('setDefaultDescription')}
			>
				{confirmDefaultItem}
			</ConfirmDialog>
		</div>
	);
};

export default Permissions;
