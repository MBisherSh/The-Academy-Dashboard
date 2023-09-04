import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
	Breadcrumbs,
	CircularProgress,
	Link,
	Typography,
	Card,
	Grid,
	CardMedia,
	createTheme,
	ThemeProvider,
	Pagination,
	Backdrop,
} from '@mui/material';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Title from '../../../../UI/Title';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../../Utils/Axios';
import Api from '../../../../../Api/api';
import EditSubject from './EditSubject';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '../../../../UI/ConfirmDialog';
import restrictToPermission from '../../../../../Utils/restrictToPermission';
import NotAllowed from '../../../../UI/NotAllowed';
import PermissionsContext from '../../../../../PermissionsContext';

const theme = createTheme({
	typography: {
		fontFamily: 'Markazi Text, serif',
		fontSize: 16,
	},
	breakpoints: {
		values: {
			xs: 0,
			tsm: 600,
			sm: 780,
			md: 860,
			tmd: 960,
			lg: 1100,
			tlg: 1280,
			xl: 1920,
		},
	},
});
const PAGE_SIZE = 10;
const Subjects = (props) => {
	const { t, i18n } = useTranslation();
	const { permissions } = React.useContext(PermissionsContext);
	const [category, setCategory] = useState({ nameAr: 'فئة', nameEn: 'category' });
	const [newSubjectOpen, setNewSubjectOpen] = useState(false);
	const [updateSubjectOpen, setUpdateSubjectOpen] = useState(false);
	const [updatedSubject, setUpdatedSubject] = useState(false);
	const [gridLoading, setGridLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [subjects, setSubjects] = useState([]);
	const [subjectsCount, setSubjectsCount] = React.useState([]);
	const [page, setPage] = React.useState(1);
	const [deletedSubjectId, setDeletedSubjectId] = React.useState(-1);
	const [inConfirm, setInConfirm] = React.useState(false);
	const [confirmItem, setConfirmItem] = React.useState(<div></div>);
	const params = useParams();

	const handleClickNewSubjectOpen = () => {
		setNewSubjectOpen(true);
	};
	const navigate = useNavigate();
	const handleClick = (event) => {
		event.preventDefault();
		navigate('/dashboard/');
	};

	const handleCategoriesClick = (event) => {
		event.preventDefault();
		navigate('/dashboard/categories');
	};
	const handlePageChange = (event, value) => {
		console.log(value);
		setPage(value);
	};

	const handleEditSubject = (subject) => {
		setUpdateSubjectOpen(true);
		setUpdatedSubject(subject);
	};

	const handleDeleteSubject = (subject) => {
		setDeletedSubjectId(subject._id);
		setConfirmItem(<Typography variant={'p'}>{t('subjectItem') + subject[t('name')]}</Typography>);
		setInConfirm(true);
	};

	const deleteSubject = async () => {
		try {
			const result = await Axios.delete({
				url: Api.deleteSubject + `/${deletedSubjectId}`,
				accessToken: props.user.token,
			});

			if (result.status === 204) {
				setSubjects((oldSubjects) => oldSubjects.filter((c) => c._id !== deletedSubjectId));
			} else {
			}
		} catch (error) {}
	};

	useEffect(() => {
		const getSubjects = async () => {
			setGridLoading(true);
			const result = await Axios.get(Api.subjects, props.user.token, {
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				categoryId: params.categoryId,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				console.log(result.data);
				if (result.status === 200) {
					setSubjects(result.data.data);
					if (result.data.total) setSubjectsCount(result.data.total);
				}
			}
			setGridLoading(false);
		};
		getSubjects();
	}, [params.categoryId, t, page, props.user.token]);

	const location = useLocation();
	useEffect(() => {
		if (location.state && location.state.category) setCategory(location.state.category);
		else {
			const getCategory = async () => {
				const result = await Axios.get(Api.categories + `/${params.categoryId}`);

				if (result.error) {
					console.log(result.error);
					// setError(true);
					// setErrorMessage(t('connectionError'));
				} else {
					if (result.status === 200) {
						setCategory(result.data.data);
					}
				}
			};
			getCategory();
		}
	}, [params.categoryId,location]);


	if (restrictToPermission('CONTROL_DATA', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Link underline="hover" color="inherit" href="/dashboard/categories" onClick={handleCategoriesClick}>
					{t('categories')}
				</Link>
				<Typography color="text.primary">{category[t('name')]}</Typography>
			</Breadcrumbs>
			<Box sx={{ display: 'flex', justifyContent: 'start', marginTop: '1rem', marginBottom: '1rem' }}>
				<Button
					variant="outlined"
					onClick={handleClickNewSubjectOpen}
					sx={i18n.dir() === 'ltr' ? { marginRight: '1rem' } : { marginLeft: '1rem' }}
				>
					{t('addSubjectTitle')}
				</Button>
				<EditSubject
					open={newSubjectOpen || updateSubjectOpen}
					setOpen={setNewSubjectOpen}
					setLoading={setLoading}
					setSubjects={setSubjects}
					user={props.user}
					update={updateSubjectOpen}
					setUpdate={setUpdateSubjectOpen}
					updatedSubject={updatedSubject}
					setUpdatedSubject={setUpdatedSubject}
					category={category}
				/>
			</Box>
			<ThemeProvider theme={theme}>
				<Card>
					<CardContent>
						<Title>{t('allSubjects')}</Title>
						<Grid container spacing={2}>
							{gridLoading && (
								<Grid item xs={4} tsm={6} sm={6} md={4} tmd={3} lg={2.4} key={-1}>
									<CircularProgress />
								</Grid>
							)}
							{!gridLoading &&
								subjects.map((subject, index) => (
									<Grid item xs={4} tsm={6} sm={6} md={4} tmd={3} lg={2.4} key={index}>
										<Card
											sx={{
												aspectRatio: '1/1',
												height: '100%',
												position: 'relative',
												backgroundColor: '#fff',
												borderRadius: '0',
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
												transition: 'transform 0.2s ease-out',
												'&:hover': {
													transform: 'scale(1.05)',
												},
											}}
										>
											<CardMedia
												component="img"
												height="100%"
												image={
													'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' +
													subject.image
												}
												alt={subject[t('name')]}
												sx={{
													position: 'relative',
													borderRadius: '5px',
													backgroundSize: 'cover',
													objectFit: 'cover',
												}}
											/>
											<CardContent
												sx={{
													position: 'absolute',
													bottom: 0,
													width: '100%',
													color: '#fff',
													padding: '16px',
													boxSizing: 'border-box',
													textAlign: 'center',
													backgroundImage:
														'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<Typography
														variant="h7"
														component="div"
														sx={{ fontWeight: 'bold' }}
													>
														{subject[t('name')]}
													</Typography>
													<Box>
														<Tooltip title={t('edit')}>
															<IconButton
																onClick={(event) => {
																	event.preventDefault();
																	handleEditSubject(subject);
																}}
															>
																<EditIcon sx={{ color: 'white' }} />
															</IconButton>
														</Tooltip>
														<Tooltip title={t('delete')}>
															<IconButton
																onClick={(event) => {
																	event.preventDefault();
																	handleDeleteSubject(subject);
																}}
															>
																<DeleteIcon sx={{ color: 'red' }} />
															</IconButton>
														</Tooltip>
													</Box>
												</Box>
											</CardContent>
										</Card>
									</Grid>
								))}
						</Grid>
					</CardContent>
				</Card>
			</ThemeProvider>
			<Pagination
				sx={{ marginTop: '0.5rem', direction: 'ltr' }}
				count={Math.ceil(subjectsCount / PAGE_SIZE)}
				color="primary"
				page={page}
				onChange={handlePageChange}
			/>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<ConfirmDialog
				setLoading={setLoading}
				open={inConfirm}
				setOpen={setInConfirm}
				onOk={deleteSubject}
				title={t('deleteConfirm')}
				description={t('deleteDescription')}
			>
				{confirmItem}
			</ConfirmDialog>
		</div>
	);
};

export default Subjects;
