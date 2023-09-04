import React, { useEffect, useState } from 'react';
import classes from './Home.module.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Title from '../../../UI/Title';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SquareIcon from '@mui/icons-material/Square';
import Axios from '../../../../Utils/Axios';
import Snackbar from '../../../UI/Snackbar';
import Api from '../../../../Api/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const Home = (props) => {
	const [publicCourseCount, setPublicCourseCount] = useState(0);
	const [privateCourseCount, setPrivateCourseCount] = useState(0);
	const [studentCount, setStudentCount] = useState(0);
	const [coachCount, setCoachCount] = useState(0);
	const [categoryCount, setCategoryCount] = useState(0);
	const [subjectCount, setSubjectCount] = useState(0);
	const [allTimeProfits, setAllTimeProfits] = useState(0);
	const [sixMonthsAgoProfits, setSixMonthsAgoProfits] = useState([]);
	const [error, setError] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const { t } = useTranslation();
	const navigate = useNavigate();
	const handleSeeButtonClick = (destination) => (event) => {
		event.preventDefault();
		navigate(destination);
	};
	useEffect(() => {
		const getGeneralStatistics = async () => {
			const result = await Axios.get(Api.generalStatistics, props.user.token);
			if (result.error) {
				console.log(result.error);
				setError(true);
				setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					setCategoryCount(result.data.categoryCount);
					setSubjectCount(result.data.subjectCount);
					result.data.userCount.forEach((u) => {
						if (u._id === 1) setStudentCount(u.count);
						if (u._id === 2) setCoachCount(u.count);
					});
					result.data.courseCount.forEach((c) => {
						if (c._id) setPrivateCourseCount(c.count);
						else setPublicCourseCount(c.count);
					});
				} else {
					setError(true);
					setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getGeneralStatistics();
	}, [props.user.token, t]);

	useEffect(() => {
		const getPaymentsStatistics = async () => {
			const result = await Axios.get(Api.paymentsStatistics, props.user.token);
			if (result.error) {
				console.log(result.error);
				setError(true);
				setErrorMessage(t('connectionError'));
			} else {
				if (result.status === 200) {
					result.data.allTimeProfits.forEach((p) => {
						if (p._id === 'deposit') setAllTimeProfits(p.totalAmount);
					});
					let arr = result.data.sixMonthsAgoProfits.sort((a, b) => a.month - b.month);
					arr = arr.map((p) => {
						return { month: t(p.month), total: p.total };
					});
					setSixMonthsAgoProfits(arr);
				} else {
					setError(true);
					setErrorMessage(t('somethingWrongError'));
				}
			}
		};
		getPaymentsStatistics();
	}, [props.user.token, t]);

	return (
		<div className={classes.home}>
			<Breadcrumbs aria-label="breadcrumb">
				<Typography color="inherit">{t('dashboard')}</Typography>
				<Typography color="text.primary">{t('home')}</Typography>
			</Breadcrumbs>

			<div className={classes.stats}>
				<Card className={classes.statsItem}>
					<CardContent>
						<Title>{t('numberOfStudents')}</Title>
						<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
							{studentCount}
						</Typography>
					</CardContent>
					<CardActions>
						<Button onClick={handleSeeButtonClick('/dashboard/users')} size="small">
							{t('seeStudents')}
						</Button>
					</CardActions>
				</Card>
				<Card className={classes.statsItem}>
					<CardContent>
						<Title>{t('numberOfCoaches')}</Title>
						<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
							{coachCount}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handleSeeButtonClick('/dashboard/users')}>
							{t('seeCoaches')}
						</Button>
					</CardActions>
				</Card>
				<Card className={classes.statsItem}>
					<CardContent>
						<Title>{t('numberOfCategories')}</Title>
						<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
							{categoryCount}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handleSeeButtonClick('/dashboard/categories')}>
							{t('seeCategories')}
						</Button>
					</CardActions>
				</Card>
				<Card className={classes.statsItem}>
					<CardContent>
						<Title>{t('numberOfSubjects')}</Title>
						<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
							{subjectCount}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handleSeeButtonClick('/dashboard/categories')}>
							{t('seeSubjects')}
						</Button>
					</CardActions>
				</Card>
			</div>
			<div className={classes.charts}>
				<Card className={classes.chartsItem + ' ' + classes.courses}>
					<CardContent>
						<Title>{t('numberOfCourses')}</Title>
						<Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
							<div>
								<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
									{privateCourseCount + publicCourseCount}
								</Typography>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'start',
										alignItems: 'center',
										marginTop: '1rem',
									}}
								>
									<SquareIcon sx={{ color: 'gold', marginBottom: '3px' }} />
									<Typography variant="p" component="div">
										{t('private')}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
									<SquareIcon sx={{ color: 'green', marginBottom: '3px' }} />
									<Typography variant="p" component="div">
										{t('public')}
									</Typography>
								</Box>
							</div>
							<PieChart width={200} height={200}>
								<Pie
									className={classes.ltr}
									data={[{ count: privateCourseCount }, { count: publicCourseCount }]}
									dataKey="count"
									cx="50%"
									cy="50%"
									outerRadius={60}
									fill="#8884d8"
									labelLine={false}
									label={renderCustomizedLabel}
								>
									<Cell key={'private'} fill={'gold'} />
									<Cell key={'public'} fill={'green'} />
								</Pie>
							</PieChart>
						</Box>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handleSeeButtonClick('/dashboard/courses')}>
							{t('seeCourses')}
						</Button>
					</CardActions>
				</Card>
				<Card className={classes.chartsItem + ' ' + classes.profits}>
					<CardContent>
						<Title>{t('profits')}</Title>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<Typography color="text.secondary" variant="p" component="div">
									{t('allTimeProfits')}
								</Typography>
								<Typography  sx={{ fontWeight: '600' }} variant="h5" component="div">
									{allTimeProfits.toLocaleString(t('locales'), {
										style: 'currency',
										currency:'SYP'
									})}
								</Typography>
							</div>
							<BarChart
								width={400}
								height={200}
								data={sixMonthsAgoProfits}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis className={classes.ltr} />
								<Tooltip />
								<Legend />
								<Bar name={t('total')} dataKey="total" fill="#8884d8" />
							</BarChart>
						</Box>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handleSeeButtonClick('/dashboard/payments')}>
							{t('seeTransactions')}
						</Button>
					</CardActions>
				</Card>
			</div>
			<Snackbar open={error} setOpen={setError} errorMessage={errorMessage} severity={'error'} />
		</div>
	);
};

export default Home;
