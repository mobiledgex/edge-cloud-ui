import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import {Grid, makeStyles } from '@material-ui/core';
import { Icon, Input, Button } from 'semantic-ui-react';
import { VERIFY_EMAIL, VERIFY_PASSWORD } from '../../../helper/constant/perpetual';
import clsx from 'clsx';

const useStyles = makeStyles({
    signUp: {
        padding: '0 20px 0 20px'
    },
    container: {
        padding: 30
    },
    textColor: {
        color: '#FFF'
    },
    userInput: {
        width: '80%',
        color: 'white',
        marginLeft: 15
    },
    validation: {
        float: 'left',
        display: 'inline',
        left: 0,
        cursor: 'pointer',
        marginBottom: 15,
        marginTop: 0,
        color: '#C4D3DC'
    },
    validationRight: { float: 'right', right: 0 },
    linkContainer: {
        fontSize: 13,
        padding: '0',
        marginTop:30,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:15
    },
    aLink: {
        fontStyle: 'italic',
        textDecoration: 'underline',
        color: "rgba(255,255,255,.5)",
        cursor: 'pointer',
        '&:hover': {
            color: '#93E019',
            textDecoration: 'underline',
        }
    }
});

const Login = (props) => {
    const history = useHistory()
    const [loginDanger, setLoginDanger] = React.useState('')
    const [username, setUsername] = React.useState(undefined)
    const [password, setPassword] = React.useState(undefined)
    const [visiblity, setVisiblity] = React.useState(false)
    const classes = useStyles();

    const onChangeUser = (e, { name, value }) => {
        setUsername(value)
    }

    const onChangePassword = (e, { name, value }) => {
        setPassword(value)
    }

    const onSubmit = () => {
        let msg = ''
        if (!username && !password) {
            msg = 'Insert Username and Password';
        } else if (!username) {
            msg = 'Insert Username';
        } else if (!password) {
            msg = 'Insert Password';
        }
        setLoginDanger(msg)
        props.onSubmit(username, password)
    }

    const reValidate = (type) => {
        history.push({
            pathname: '/forgotpassword',
            state: { type }
        });
    }
    return (
        <React.Fragment>
            <span className='title'>Sign into your account</span>
            <div className={classes.container}>
                <Grid className={classes.signUp}>
                    <Grid item>
                        <Icon name='user outline' className={clsx(classes.textColor)} /><sup>{' *'}</sup>
                        <Input className={classes.userInput} placeholder='Username or Email' name='username' onChange={onChangeUser} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </Grid>
                    <br />
                    <Grid item>
                        <Icon name='keyboard outline' className={clsx(classes.textColor)} /><sup >{' *'}</sup>
                        <Input icon={<Icon className={clsx(classes.textColor)} name={visiblity ? 'unhide' : 'hide'} link onClick={() => { setVisiblity(!visiblity) }} />} autoComplete="off" className={classes.userInput} placeholder='Password' name='password' type={visiblity ? 'text' : 'password'} onChange={onChangePassword} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </Grid>
                    <div className="loginValidation">
                        {loginDanger}
                    </div>
                </Grid>
                <div className={clsx(classes.textColor, classes.validation)} onClick={() => reValidate(VERIFY_EMAIL)}>Verify Email</div>
                <div className={clsx(classes.textColor, classes.validation, classes.validationRight)} onClick={() => reValidate(VERIFY_PASSWORD)}>Forgot Password</div>
                <Button onClick={() => onSubmit()}>Log In</Button>
                <div className={classes.linkContainer}>
                    <Link className={classes.aLink} to="/terms-of-use" target="_blank">Terms of Use</Link>
                    <Link className={classes.aLink} to="/acceptable-use-policy" target="_blank" >Acceptable Use Policy</Link>
                    <a className={classes.aLink} href="https://mobiledgex.com/privacy-policy/" target="_blank">Privacy Policy</a>
                    <a className={classes.aLink} href="https://status.mobiledgex.com" target="_blank">Status</a>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login