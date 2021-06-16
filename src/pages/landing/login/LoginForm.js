import React from 'react'
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { Icon, Input, Button } from 'semantic-ui-react';
import { perpetual } from '../../../helper/constant';


const Login = (props) => {
    const history = useHistory()
    const [loginDanger, setLoginDanger] = React.useState('')
    const [username, setUsername] = React.useState(undefined)
    const [password, setPassword] = React.useState(undefined)
    const [visiblity, setVisiblity] = React.useState(false)

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

    const reValidate = (type)=>{
        history.push({
            pathname: '/forgotpassword',
            state: { type }
        });
    }
    return (
        <React.Fragment>
            <br />
            <span className='title'>Sign into your account</span>
            <div style={{ padding: 30 }}>
                <Grid className="signUpBD" style={{ padding: '0 20px 0 20px' }}>
                    <Grid item>
                        <Icon name='user outline' style={{ color: '#FFF' }} /><sup style={{ color: '#FFF' }}>{' *'}</sup>
                        <Input style={{ width: '80%', color: 'white', marginLeft: 15 }} placeholder='Username or Email' name='username' onChange={onChangeUser} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </Grid>
                    <br />
                    <Grid item>
                        <Icon name='keyboard outline' style={{ color: '#FFF' }} /><sup style={{ color: '#FFF' }}>{' *'}</sup>
                        <Input icon={<Icon name={visiblity ? 'unhide' : 'hide'} link onClick={() => { setVisiblity(!visiblity) }} />} autoComplete="off" style={{ width: '80%', color: 'white', marginLeft: 15 }} placeholder='Password' name='password' type={visiblity ? 'text' : 'password'} onChange={onChangePassword} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </Grid>
                    <div className="loginValidation">
                        {loginDanger}
                    </div>
                </Grid>
                <div style={{ float: 'left', display: 'inline', left: 0, color: 'white', cursor: 'pointer', marginBottom: 15, marginTop: 0, color:'#C4D3DC' }} onClick={() => reValidate(perpetual.VERIFY_EMAIL)}>Verify Email</div>
                <div style={{ float: 'right', display: 'inline', right: 0, color: 'white', cursor: 'pointer', marginBottom: 15, marginTop: 0, color:'#C4D3DC' }} onClick={()=> reValidate(perpetual.VERIFY_PASSWORD)}>Forgot Password</div>
                <Button onClick={() => onSubmit()}>Log In</Button>
            </div>
        </React.Fragment>
    )
}

export default Login