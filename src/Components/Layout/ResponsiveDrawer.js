import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import PaymentsIcon from '@mui/icons-material/Payments';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PolicyIcon from '@mui/icons-material/Policy';
import CategoryIcon from '@mui/icons-material/Category';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import classes from './ResponsiveDrawer.module.css';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-theAcademy.png';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';
const drawerWidth = 240;

function ResponsiveDrawer(props) {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const languages = { en: { nativeName: 'English' }, ar: { nativeName: 'العربية' } };
	const LANG_KEY = 'language';
	const handleClick = (event) => {
		if (i18n.language === 'ar') i18n.changeLanguage('en');
		else {
			i18n.changeLanguage('ar');
		}

		localStorage.setItem(LANG_KEY, i18n.language);
	};
	const user = props.user;

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const logOutHandler = () => {
		localStorage.setItem('user', null);
		props.setUser(null);
		navigate('/login');
	};

	const drawer = (
		<div>
			<Box
				sx={{
					backgroundColor: '#ffffff',
					height: '4rem',
					display: 'flex',
					justifyContent: 'start',
					alignItems: 'center',
				}}
			>
				<img className={classes.img} src={logo} alt="logo-white" />
				<Typography variant="h6">{t('theAcademy')}</Typography>
			</Box>
			<Divider />
			<List>
				{[
					{ text: t('home'), icon: HomeIcon, link: '/dashboard/' },
					{ text: t('accessControl'), icon: KeyIcon, link: '/dashboard/rbac' },
					{ text: t('transactions'), icon: PaymentsIcon, link: '/dashboard/payments' },
					{ text: t('users'), icon: GroupIcon, link: '/dashboard/users' },
					{ text: t('categories'), icon: CategoryIcon, link: '/dashboard/categories' },
					{ text: t('courses'), icon: SchoolIcon, link: '/dashboard/courses' },
					{ text: t('privacyPolicy'), icon: PolicyIcon, link: '/dashboard/privacy-policy' },
				].map((item, index) => {
					const ItemIcon = item.icon;
					return (
						<ListItem key={item.text} disablePadding>
							<Link to={item.link} className={classes.link}>
								<ListItemButton sx={{ textAlign: i18n.dir() === 'rtl' ? 'right' : 'left' }}>
									<ListItemIcon>
										<ItemIcon />
									</ListItemIcon>
									<ListItemText
										primaryTypographyProps={{
											fontWeight: '600',
										}}
										primary={item.text}
									/>
								</ListItemButton>
							</Link>
						</ListItem>
					);
				})}
			</List>
			<Divider />
			<List>
				<ListItem key={t('logOut')} disablePadding>
					<ListItemButton sx={{ textAlign: i18n.dir() === 'rtl' ? 'right' : 'left' }} onClick={logOutHandler}>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary={t('logOut')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton
						sx={{ textAlign: i18n.dir() === 'rtl' ? 'right' : 'left' }}
						color="inherit"
						onClick={handleClick}
					>
						<ListItemIcon>
							<TranslateIcon />
						</ListItemIcon>
						<ListItemText primary={languages[i18n.language].nativeName} />
					</ListItemButton>
				</ListItem>
			</List>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	const m = i18n.dir() === 'rtl' ? 'mr' : 'ml';
	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					[m]: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{t('adminDashboard')}
					</Typography>
					<div className={classes.horizon}>
						<Avatar
							className={classes.avatar}
							alt="profileImage"
							src={
								'https://the-academy-assets-public.s3.us-east-2.amazonaws.com/' + user.user.profileImage
							}
						/>
						<Typography variant="h6">{user.user.name}</Typography>
					</div>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer
					anchor={i18n.dir() === 'rtl' ? 'right' : 'left'}
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					anchor={i18n.dir() === 'rtl' ? 'right' : 'left'}
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: '#f5f5f5' }}
			>
				<Toolbar />
				{props.children}
			</Box>
		</Box>
	);
}

ResponsiveDrawer.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default ResponsiveDrawer;
