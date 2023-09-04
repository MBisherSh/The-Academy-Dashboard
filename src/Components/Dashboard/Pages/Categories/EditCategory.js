import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import Dialog from '../../../UI/Dialog';
import Joi from '../../../../Utils/Joi';
import commonChains from '../../../../Utils/commonChains';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import ImageButton from '../../../UI/ImageButton';
import placeholderImage from '../../../../assets/placeholder-image.png';
import ErrorContext from '../../../../ErrorContext';

const EditCategory = (props) => {
	const { t } = useTranslation();
	//const [editCategoryId, setEditCategoryId] = useState('');
	const [editCategoryNameAr, setEditCategoryNameAr] = useState('');
	const [editCategoryNameEn, setEditCategoryNameEn] = useState('');
	const [editCategoryImageUrl, setEditCategoryImageUrl] = useState(placeholderImage);
	const [editCategoryImageFile, setEditCategoryImageFile] = useState(placeholderImage);
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);

	const handleUploadClick = (event) => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.addEventListener('change', (event) => {
			const file = event.target.files[0];
			setEditCategoryImageFile(file);
			setEditCategoryImageUrl(URL.createObjectURL(file));
		});
		fileInput.click();
	};

	useEffect(() => {
		if (props.update && props.updatedCategory) {
			//setEditCategoryId(props.updatedCategory._id);
			setEditCategoryNameAr(props.updatedCategory.nameAr || '');
			setEditCategoryNameEn(props.updatedCategory.nameEn || '');
			if (props.updatedCategory.image)
				setEditCategoryImageUrl(
					'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' + props.updatedCategory.image
				);
		} else {
			//setEditCategoryId('');
			setEditCategoryNameAr('');
			setEditCategoryNameEn('');
			setEditCategoryImageUrl(placeholderImage);
		}
	}, [props.update, props.updatedCategory]);

	const addCategory = async () => {
		setValidationError('');
		try {
			const data = {
				nameAr: editCategoryNameAr,
				nameEn: editCategoryNameEn,
			};

			await Joi.generator(
				{
					nameAr: commonChains.stringRequired,
					nameEn: commonChains.stringRequired,
				},
				data
			);
			const formData = new FormData();
			if (editCategoryImageFile === placeholderImage) {
				setError({ inError: true, errorMessage: t('imageValidationError') });
				return;
			}

			formData.append('image', editCategoryImageFile);
			formData.append('nameAr', editCategoryNameAr);
			formData.append('nameEn', editCategoryNameEn);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.post({
				url: Api.createCategory,
				data: formData,
				accessToken: props.user.token,
				formData: true,
			});
			props.setLoading(false);

			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 201) {
					props.setCategories((oldCategories) => [result.data.category, ...oldCategories]);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}

			setEditCategoryNameAr('');
			setEditCategoryNameEn('');
			setEditCategoryImageUrl(placeholderImage);
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

	const updateCategory = async () => {
		setValidationError('');
		try {
			const data = {
				nameAr: editCategoryNameAr,
				nameEn: editCategoryNameEn,
			};

			await Joi.generator(
				{
					nameAr: commonChains.stringOptional,
					nameEn: commonChains.stringOptional,
				},
				data
			);
			const formData = new FormData();
			if (editCategoryImageFile !== placeholderImage) formData.append('image', editCategoryImageFile);
			formData.append('nameAr', editCategoryNameAr);
			formData.append('nameEn', editCategoryNameEn);
			props.setLoading(true);
			props.setUpdate(false);
			const result = await Axios.patch({
				url: Api.updateCategory + `/${props.updatedCategory._id}`,
				data: formData,
				formData: true,
				accessToken: props.user.token,
			});
			props.setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError({ inError: true, errorMessage: t('connectionError') });
			} else {
				if (result.status === 200) {
					props.setCategories((oldCategories) => {
						return oldCategories.map((category) => {
							if (category._id === props.updatedCategory._id) {
								return result.data.category;
							} else return category;
						});
					});
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
			props.setUpdatedCategory({});

			setEditCategoryNameAr('');
			setEditCategoryNameEn('');
			setEditCategoryImageUrl(placeholderImage);
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

	const editCategoryNameArChangedHandler = (event) => {
		setEditCategoryNameAr(event.target.value);
	};

	const editCategoryNameEnChangedHandler = (event) => {
		setEditCategoryNameEn(event.target.value);
	};

	return (
		<Dialog
			open={props.open}
			setOpen={props.setOpen}
			title={t(props.update ? 'updateCategoryTitle' : 'addCategoryTitle')}
			description={t('addCategoryDescription')}
			onOk={props.update ? updateCategory : addCategory}
			onClose={() => {
				props.setUpdate(false);
				props.setUpdatedCategory({});
			}}
		>
			<TextField
				autoFocus
				margin="dense"
				id="nameAr"
				label={t('nameAr')}
				type="text"
				fullWidth
				variant="standard"
				value={editCategoryNameAr}
				onChange={editCategoryNameArChangedHandler}
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
				value={editCategoryNameEn}
				onChange={editCategoryNameEnChangedHandler}
				sx={{ marginBottom: '1rem' }}
				error={validationError === 'nameEn'}
			/>

			<ImageButton
				onClick={handleUploadClick}
				title={t('uploadImage')}
				width={'100%'}
				url={editCategoryImageUrl}
			/>
		</Dialog>
	);
};

export default EditCategory;
