import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Title from '../../../UI/Title';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import EditCategory from './EditCategory';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '../../../UI/ConfirmDialog';
import PermissionsContext from '../../../../PermissionsContext';
import restrictToPermission from '../../../../Utils/restrictToPermission';
import NotAllowed from '../../../UI/NotAllowed';

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
const Categories = (props) => {
	const { permissions } = React.useContext(PermissionsContext);
	const { t, i18n } = useTranslation();
	const [newCategoryOpen, setNewCategoryOpen] = useState(false);
	const [updateCategoryOpen, setUpdateCategoryOpen] = useState(false);
	const [updatedCategory, setUpdatedCategory] = useState(false);
	const [gridLoading, setGridLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [categoriesCount, setCategoriesCount] = React.useState([]);
	const [page, setPage] = React.useState(1);
	const [deletedCategoryId, setDeletedCategoryId] = React.useState(-1);
	const [inConfirm, setInConfirm] = React.useState(false);
	const [confirmItem, setConfirmItem] = React.useState(<div></div>);

	const handleClickNewCategoryOpen = () => {
		setNewCategoryOpen(true);
	};
	const navigate = useNavigate();
	const handleClick = (event) => {
		event.preventDefault();
		navigate('/dashboard/');
	};
	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleEditCategory = (category) => {
		setUpdateCategoryOpen(true);
		setUpdatedCategory(category);
	};

	const handleDeleteCategory = (category) => {
		setDeletedCategoryId(category._id);
		setConfirmItem(<Typography variant={'p'}>{t('categoryItem') + category[t('name')]}</Typography>);
		setInConfirm(true);
	};

	const deleteCategory = async () => {
		try {
			const result = await Axios.delete({
				url: Api.deleteCategory + `/${deletedCategoryId}`,
				accessToken: props.user.token,
			});

			if (result.status === 204) {
				setCategories((oldCategories) => oldCategories.filter((c) => c._id !== deletedCategoryId));
			} else {
			}
		} catch (error) {}
	};

	useEffect(() => {
		const getCategories = async () => {
			setGridLoading(true);
			const result = await Axios.get(Api.categories, props.user.token, {
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setCategories(result.data.data);
					if (result.data.total) setCategoriesCount(result.data.total);
				}
			}
			setGridLoading(false);
		};
		getCategories();
	}, [props.user.token, t, page]);

	const openSubjects = (category) => {
		navigate(`/dashboard/categories/${category._id}`, { state: { category } });
	};


	if (restrictToPermission('CONTROL_DATA', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('categories')}</Typography>
			</Breadcrumbs>
			<Box sx={{ display: 'flex', justifyContent: 'start', marginTop: '1rem', marginBottom: '1rem' }}>
				<Button
					variant="outlined"
					onClick={handleClickNewCategoryOpen}
					sx={i18n.dir() === 'ltr' ? { marginRight: '1rem' } : { marginLeft: '1rem' }}
				>
					{t('addCategoryTitle')}
				</Button>
				<EditCategory
					open={newCategoryOpen || updateCategoryOpen}
					setOpen={setNewCategoryOpen}
					setLoading={setLoading}
					setCategories={setCategories}
					user={props.user}
					update={updateCategoryOpen}
					setUpdate={setUpdateCategoryOpen}
					updatedCategory={updatedCategory}
					setUpdatedCategory={setUpdatedCategory}
				/>
			</Box>
			<ThemeProvider theme={theme}>
				<Card>
					<CardContent>
						<Title>{t('allCategories')}</Title>
						<Grid container spacing={2}>
							{gridLoading && (
								<Grid item xs={4} tsm={6} sm={6} md={4} tmd={3} lg={2.4} key={-1}>
									<CircularProgress />
								</Grid>
							)}
							{!gridLoading &&
								categories.map((category, index) => (
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
													cursor: 'pointer',
												},
											}}
										>
											<Link href={`/dashboard/categories/${category._id}`} onClick={(event) => {
												event.preventDefault();
												openSubjects(category);
											}}>
												<CardMedia

													component="img"
													height="100%"
													image={
														'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' +
														category.image
													}
													alt={category[t('name')]}
													sx={{
														position: 'relative',
														borderRadius: '5px',
														backgroundSize: 'cover',
														objectFit: 'cover',
													}}
												/>
											</Link>

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
														{category[t('name')]}
													</Typography>
													<Box>
														<Tooltip title={t('edit')}>
															<IconButton
																onClick={(event) => {
																	event.preventDefault();
																	handleEditCategory(category);
																}}
															>
																<EditIcon sx={{ color: 'white' }} />
															</IconButton>
														</Tooltip>
														<Tooltip title={t('delete')}>
															<IconButton
																onClick={(event) => {
																	event.preventDefault();
																	handleDeleteCategory(category);
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
				count={Math.ceil(categoriesCount / PAGE_SIZE)}
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
				onOk={deleteCategory}
				title={t('deleteConfirm')}
				description={t('deleteDescription')}
			>
				{confirmItem}
			</ConfirmDialog>
		</div>
	);
};

export default Categories;
