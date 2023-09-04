import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackbarComponent = (props) => {


	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		props.setOpen(false);
	};

	return (
		<Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
			<Alert onClose={handleClose} severity={props.severity} variant="filled">
				{props.errorMessage}
			</Alert>
		</Snackbar>
	);
};

export default SnackbarComponent;
