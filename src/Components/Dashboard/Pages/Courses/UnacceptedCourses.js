import {
	Typography,
	Card,
	Avatar,
	Grid,
	CardMedia,
	CardActions,
	createTheme,
	ThemeProvider,
	Pagination,
	Backdrop,
	CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Title from '../../../UI/Title';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { red } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import Axios from '../../../../Utils/Axios';
import Api from '../../../../Api/api';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import VerifiedIcon from '@mui/icons-material/Verified';
import ConfirmDialog from '../../../UI/ConfirmDialog';
import classes from './UnAcceptedCourses.module.css'
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

const Courses = (props) => {
	const { t } = useTranslation();
	const [unacceptedCourses, setUnacceptedCourses] = useState([]);
	const [unacceptedCoursesCount, setUnacceptedCoursesCount] = React.useState([]);
	const [unacceptedCoursesPage, setUnacceptedCoursesPage] = React.useState(1);
	const [loading, setLoading] = useState(false);
	const [acceptedCourseId, setAcceptedCourseId] = React.useState('');
	const [inConfirm, setInConfirm] = React.useState(false);
	const [confirmItem, setConfirmItem] = React.useState(<div></div>);
	const PAGE_SIZE = 3;

	const handleUnacceptedCoursesPageChange = (event, value) => {
		setUnacceptedCoursesPage(value);
	};

	const handleAcceptButtonClick = (course) => {
		setConfirmItem(<Typography variant={'p'}>{t('courseItem') + course[t('name')]}</Typography>);
		setAcceptedCourseId(course._id);
		setInConfirm(true);
	};
	const acceptCourse = async () => {
		try {
			const result = await Axios.patch({
				url: Api.acceptCourse + `/${acceptedCourseId}`,
				accessToken: props.user.token,
			});

			if (result.status === 200) {
				setUnacceptedCourses((oldCourses) => oldCourses.filter((c) => c._id !== acceptedCourseId));
				props.setAllCourses((oldCourses) => [result.data.course, ...oldCourses]);
			} else {
			}
		} catch (error) {}
	};

	useEffect(() => {
		const getUnacceptedCourses = async () => {
			const result = await Axios.get(Api.unacceptedCourses, props.user.token, {
				limit: PAGE_SIZE,
				offset: (unacceptedCoursesPage - 1) * PAGE_SIZE,
			});

			if (result.error) {
				console.log(result.error);
				// setError(true);
				// setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setUnacceptedCourses(result.data.data);
					if (result.data.total) setUnacceptedCoursesCount(result.data.total);
				}
			}
		};
		getUnacceptedCourses();
	}, [t, unacceptedCoursesPage, props.user.token]);

	return (
		<div>
			<ThemeProvider theme={theme}>
				<Card>
					<CardContent>
						<Title>{t('unacceptedCourses')}</Title>
						<Grid container spacing={2}>
							{unacceptedCourses.map((item, index) => (
								<Grid item xs={12} tsm={12} sm={6} md={6} tmd={6} lg={4} key={index}>
									<Card
										sx={{
											height: '100%',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
											transition: 'transform 0.2s ease-out',
											'&:hover': {
												transform: 'scale(1.05)',
											},
										}}
									>
										<CardMedia
											component="img"
											height="194"
											image={
												'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' +
												item.image
											}
											alt={item[t('name')]}
										/>
										<CardContent
											className={classes.unaccepted}
										>
											<Box>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'start',
															alignItems: 'center',
														}}
													>
														<Avatar
															src={
																item.owner?.profileImage
																	? 'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' +
																	  item.owner.profileImage
																	: ''
															}
															alt={item.owner.name}
															sx={{ bgcolor: red[500], height: '27px', width: '27px' }}
															aria-label="owner-avatar"
														/>
														<Typography
															variant={'subtitle1'}
															sx={{
																fontWeight: 'bold',
																marginLeft: '5px',
																marginRight: '5px',
															}}
														>
															{item.owner.name}
														</Typography>
													</Box>
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'start',
															alignItems: 'center',
														}}
													>
														{item.isPrivate ? (
															<LockIcon sx={{ color: 'gold' }} />
														) : (
															<PublicIcon sx={{ color: 'green' }} />
														)}
														<Typography
															variant={'subtitle1'}
															sx={{ marginLeft: '3px', marginRight: '3px' }}
														>
															{item.isPrivate ? t('private') : t('public')}
														</Typography>
													</Box>
												</Box>
												<Typography variant="h6">
													{item[t('name')]}
													{item.subject && ' - ' + item.subject[t('name')]}
												</Typography>
												<Typography variant="subtitle1">{t('aboutCourse')}</Typography>
												<Typography variant="body2" color="text.secondary">
													{item[t('description')]}
												</Typography>
											</Box>

											<Button
												sx={{ width: '100%', marginTop: '0.5rem', alignItems: 'center' }}
												variant="contained"
												endIcon={<VerifiedIcon />}
												onClick={() => {
													handleAcceptButtonClick(item);
												}}
											>
												<Typography marginX={'0.5rem'}>{t('accept')}</Typography>
											</Button>
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
				count={Math.ceil(unacceptedCoursesCount / PAGE_SIZE)}
				color="primary"
				page={unacceptedCoursesPage}
				onChange={handleUnacceptedCoursesPageChange}
			/>
			<ConfirmDialog
				setLoading={setLoading}
				open={inConfirm}
				setOpen={setInConfirm}
				onOk={acceptCourse}
				title={t('acceptConfirm')}
				description={t('acceptDescription')}
			>
				{confirmItem}
			</ConfirmDialog>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
};

export default Courses;
