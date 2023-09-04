import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import Dialog from '../../../../UI/Dialog';
import Joi from '../../../../../Utils/Joi';
import commonChains from '../../../../../Utils/commonChains';
import Axios from '../../../../../Utils/Axios';
import Api from '../../../../../Api/api';
import ImageButton from '../../../../UI/ImageButton';
import placeholderImage from '../../../../../assets/placeholder-image.png';
import ErrorContext from '../../../../../ErrorContext';

const EditSubject = (props) => {
	const { t } = useTranslation();
	//const [editSubjectId, setEditSubjectId] = useState('');
	const [editSubjectNameAr, setEditSubjectNameAr] = useState('');
	const [editSubjectNameEn, setEditSubjectNameEn] = useState('');
	const [editSubjectImageUrl, setEditSubjectImageUrl] = useState(placeholderImage);
	const [editSubjectImageFile, setEditSubjectImageFile] = useState(placeholderImage);
	const [validationError, setValidationError] = useState('');
	const { setError } = useContext(ErrorContext);

	const handleUploadClick = (event) => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.addEventListener('change', (event) => {
			const file = event.target.files[0];
			setEditSubjectImageFile(file);
			setEditSubjectImageUrl(URL.createObjectURL(file));
		});
		fileInput.click();
	};

	useEffect(() => {
		if (props.update && props.updatedSubject) {
			//setEditSubjectId(props.updatedSubject._id);
			setEditSubjectNameAr(props.updatedSubject.nameAr || '');
			setEditSubjectNameEn(props.updatedSubject.nameEn || '');
			if (props.updatedSubject.image)
				setEditSubjectImageUrl(
					'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' + props.updatedSubject.image
				);
		} else {
			//setEditSubjectId('');
			setEditSubjectNameAr('');
			setEditSubjectNameEn('');
			setEditSubjectImageUrl(placeholderImage);
		}
	}, [props.update, props.updatedSubject]);

	const addSubject = async () => {
		setValidationError('');
		try {
			const data = {
				nameAr: editSubjectNameAr,
				nameEn: editSubjectNameEn,
				categoryId: props.category._id,
			};

			await Joi.generator(
				{
					nameAr: commonChains.stringRequired,
					nameEn: commonChains.stringRequired,
					categoryId: commonChains.stringRequired,
				},
				data
			);
			const formData = new FormData();
			if (editSubjectImageFile === placeholderImage) {
				setError({ inError: true, errorMessage: t('imageValidationError') });
				return;
			}
			formData.append('image', editSubjectImageFile);
			formData.append('nameAr', editSubjectNameAr);
			formData.append('nameEn', editSubjectNameEn);
			formData.append('categoryId', props.category._id);
			props.setLoading(true);
			props.setOpen(false);
			const result = await Axios.post({
				url: Api.createSubject,
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
					props.setSubjects((oldSubjects) => [result.data.subject, ...oldSubjects]);
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}

			setEditSubjectNameAr('');
			setEditSubjectNameEn('');
			setEditSubjectImageUrl(placeholderImage);
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

	const updateSubject = async () => {
		setValidationError('');
		try {
			const data = {
				nameAr: editSubjectNameAr,
				nameEn: editSubjectNameEn,
			};

			await Joi.generator(
				{
					nameAr: commonChains.stringOptional,
					nameEn: commonChains.stringOptional,
				},
				data
			);
			const formData = new FormData();
			if (editSubjectImageFile !== placeholderImage) formData.append('image', editSubjectImageFile);
			formData.append('nameAr', editSubjectNameAr);
			formData.append('nameEn', editSubjectNameEn);
			props.setLoading(true);
			props.setUpdate(false);
			const result = await Axios.patch({
				url: Api.updateSubject + `/${props.updatedSubject._id}`,
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
					props.setSubjects((oldSubjects) => {
						return oldSubjects.map((subject) => {
							if (subject._id === props.updatedSubject._id) {
								return result.data.subject;
							} else return subject;
						});
					});
				} else {
					console.log(result.data);
					setError({ inError: true, errorMessage: t('somethingWrongError') });
				}
			}
			props.setUpdatedSubject({});

			setEditSubjectNameAr('');
			setEditSubjectNameEn('');
			setEditSubjectImageUrl(placeholderImage);
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

	const editSubjectNameArChangedHandler = (event) => {
		setEditSubjectNameAr(event.target.value);
	};

	const editSubjectNameEnChangedHandler = (event) => {
		setEditSubjectNameEn(event.target.value);
	};

	return (
		<Dialog
			open={props.open}
			setOpen={props.setOpen}
			title={t(props.update ? 'updateSubjectTitle' : 'addSubjectTitle')}
			description={t('addSubjectDescription')}
			onOk={props.update ? updateSubject : addSubject}
			onClose={() => {
				props.setUpdate(false);
				props.setUpdatedSubject({});
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
				value={editSubjectNameAr}
				onChange={editSubjectNameArChangedHandler}
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
				value={editSubjectNameEn}
				onChange={editSubjectNameEnChangedHandler}
				sx={{ marginBottom: '1rem' }}
				error={validationError === 'nameEn'}
			/>

			<ImageButton
				onClick={handleUploadClick}
				title={t('uploadImage')}
				width={'100%'}
				url={editSubjectImageUrl}
			/>
		</Dialog>
	);
};

export default EditSubject;
