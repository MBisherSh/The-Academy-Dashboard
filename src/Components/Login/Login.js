import React,{Fragment} from 'react';
import Card from '../UI/Card';
import Welcome from './Welcome';
import LoginForm from './LoginForm';
import classes from './Login.module.css';

const Login = (props) => {
	return (
		<Fragment>
			<Card className={classes.login}>
				<Welcome />
				<LoginForm user={props.user} setUser={props.setUser} />
			</Card>
		</Fragment>
	);
};

export default Login;
