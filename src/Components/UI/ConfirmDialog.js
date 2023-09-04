import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = (props) => {
	const { t } = useTranslation();

	const handleClose = () => {
		props.setOpen(false);
	};

	const handleOk = async () => {
		props.setLoading(true);
		props.setOpen(false);
		await props.onOk();
		props.setLoading(false);
	};

	return (
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>{props.title || t('dialogDefaultTitle')}</DialogTitle>
				<DialogContent>
					<DialogContentText>{props.description}</DialogContentText>
					{props.children}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t('cancel')}</Button>
					<Button onClick={handleOk}>{t('ok')}</Button>
				</DialogActions>
			</Dialog>
	);
};

export default ConfirmDialog;
