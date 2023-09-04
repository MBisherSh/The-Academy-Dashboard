import React, { Fragment, useEffect, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '../../../UI/Dialog';
import { useTranslation } from 'react-i18next';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import ErrorContext from '../../../../ErrorContext';

const EditPrices = (props) => {
	const [editPricesOpen, setEditPricesOpen] = useState(false);
	const [newCoachFeeValue, setNewCoachFeeValue] = useState('');
	const [newCourseFeeValue, setNewCourseFeeValue] = useState('');
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);

	useEffect(() => {
		setNewCoachFeeValue(props.coachFee.value);
		setNewCourseFeeValue(props.courseFee.value);
	}, [props.coachFee, props.courseFee]);

	const { t } = useTranslation();
	const handleClickEditPricesOpen = () => {
		setEditPricesOpen(true);
	};
	const newCoachFeeValueChangedHandler = (event) => {
		setNewCoachFeeValue(event.target.value);
	};
	const newCourseFeeValueChangedHandler = (event) => {
		setNewCourseFeeValue(event.target.value);
	};

	const updatePrices = async () => {
		try {
			const data = {
				courseFee: newCourseFeeValue,
				coachFee: newCoachFeeValue,
			};
			await Joi.generator(
				{
					courseFee: commonChains.numberRequired,
					coachFee: commonChains.numberRequired,
				},
				data
			);
			props.setLoading(true);
			setEditPricesOpen(false);
			const courseFeeResult = await Axios.patch({
				url: Api.updateGeneral + `/${props.courseFee._id}`,
				data: { value: newCourseFeeValue },
				accessToken: props.user.token,
			});
			const coachFeeResult = await Axios.patch({
				url: Api.updateGeneral + `/${props.coachFee._id}`,
				data: { value: newCoachFeeValue },
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (coachFeeResult.error || courseFeeResult.error) {
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (coachFeeResult.status === 200 && courseFeeResult.status === 200) {
					props.setCoachFee(coachFeeResult.data.general);
					props.setCourseFee(courseFeeResult.data.general);
				} else {
					//console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
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

	return (
		<Fragment>
			<Button variant="outlined" onClick={handleClickEditPricesOpen}>
				{t('editPricesTitle')}
			</Button>
			<Dialog
				open={editPricesOpen}
				setOpen={setEditPricesOpen}
				title={t('editPricesTitle')}
				description={t('editPricesDescription')}
				onOk={updatePrices}
			>
				<TextField
					error={validationError === 'coachFee'}
					autoFocus
					margin="dense"
					id="coachSubscriptionFee"
					label={t('coachSubscriptionFee')}
					type="number"
					fullWidth
					variant="standard"
					value={newCoachFeeValue}
					onChange={newCoachFeeValueChangedHandler}
				/>
				<TextField
					error={validationError === 'courseFee'}
					autoFocus
					margin="dense"
					id="privateCourseFee"
					label={t('privateCourseFee')}
					type="number"
					fullWidth
					variant="standard"
					value={newCourseFeeValue}
					onChange={newCourseFeeValueChangedHandler}
				/>
			</Dialog>
		</Fragment>
	);
};
export default EditPrices;
