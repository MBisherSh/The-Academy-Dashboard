import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import AllCourses from './AllCourses';
import UnacceptedCourses from './UnacceptedCourses';
import { useTranslation } from 'react-i18next';
import PermissionsContext from '../../../../PermissionsContext';
import restrictToPermission from '../../../../Utils/restrictToPermission';
import NotAllowed from '../../../UI/NotAllowed';

const Courses = (props) => {
	const { t } = useTranslation();
	const { permissions } = React.useContext(PermissionsContext);
	const navigate = useNavigate();
	const [allCourses, setAllCourses] = useState([]);
	const handleClick = (event) => {
		event.preventDefault();

		navigate('/dashboard/');
	};

	if (restrictToPermission('ACCEPT_COURSE', permissions, props.user.user)) {
		return <NotAllowed />;
	}

	return (
		<div>
			<Breadcrumbs aria-label="breadcrumb">
				<Link underline="hover" color="inherit" href="/dashboard" onClick={handleClick}>
					{t('dashboard')}
				</Link>
				<Typography color="text.primary">{t('courses')}</Typography>
			</Breadcrumbs>
			<Box sx={{ marginTop: '1rem' }}>
				<AllCourses allCourses={allCourses} setAllCourses={setAllCourses} user={props.user} />
				<UnacceptedCourses setAllCourses={setAllCourses} user={props.user} />
			</Box>
		</div>
	);
};

export default Courses;
