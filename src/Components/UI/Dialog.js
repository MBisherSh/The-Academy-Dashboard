import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

const FormDialog = (props) => {
	const { t } = useTranslation();

	const handleClose = () => {
		props.setOpen(false);
		if (props.onClose) props.onClose();
	};

	const handleOk = async () => {
		//props.setOpen(false);
		await props.onOk();
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

export default FormDialog;
