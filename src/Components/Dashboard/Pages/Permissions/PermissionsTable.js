import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TickIcon from '@mui/icons-material/CheckBox';
import MinusIcon from '@mui/icons-material/IndeterminateCheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';

const PermissionTable = (props) => {
	const { t } = useTranslation();
	const tableRows = [];
	for (const permission in props.permissions) {
		tableRows.push({
			_id: permission,
			name: props.permissions[permission][t('name')],
			roles: props.permissions[permission].roles,
		});
	}

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
				<TableHead>
					<TableRow key={'ROLES'}>
						<TableCell sx={{ textAlign: 'start' }} key={-1}>
							{t('permission')}
						</TableCell>
						{props.roles.map((role) => {
							return (
								<TableCell key={role._id} align="center">
									<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
										{role[t('name')]}
										<Tooltip title={t('delete')}>
											<IconButton
												onClick={(event) => {
													event.preventDefault();
													props.handleDeleteRole(role._id);
												}}
												disabled={role._id === 4}
											>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</Box>
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					{tableRows.map((row) => {
						const Roles = props.roles.map((role) => {
							let Icon;
							let color;
							if (row.roles.find((r) => r._id === role._id)) {
								Icon = TickIcon;
								color = '#1e8451';
							} else {
								Icon = MinusIcon;
								color = '#882121';
							}

							return (
								<TableCell key={row._id + role._id} align="center">
									<Icon sx={{ color }} />
								</TableCell>
							);
						});
						return (
							<TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell key={row._id} component="th" scope="row">
									<Box
										sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
									>
										<Typography>{row.name}</Typography>
										<Box>
											<Tooltip title={t('edit')}>
												<IconButton
													onClick={(event) => {
														event.preventDefault();
														props.handleEditPermission(row._id);
													}}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title={t('delete')}>
												<IconButton
													onClick={(event) => {
														event.preventDefault();
														props.handleDeletePermission(row._id);
													}}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</TableCell>
								{Roles}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default PermissionTable;
