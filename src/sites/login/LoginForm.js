import React from 'react'
import { useHistory } from 'react-router';
import { Grid as MGrid } from '@material-ui/core';
import { Icon, Input, Button } from 'semantic-ui-react';


const Login = (props) => {
    const history = useHistory()
    const [loginDanger, setLoginDanger] = React.useState('')
    const [username, setUsername] = React.useState(undefined)
    const [password, setPassword] = React.useState(undefined)
    const [visiblity, setVisiblity] = React.useState(false)
    
    const onFocusHandle = (value)=>{
        setFocused(value)
    }

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


    return (
        <React.Fragment>
            <br />
            <span className='title'>Sign into your account</span>
            <div style={{ padding: 30 }}>
                <MGrid className="signUpBD" style={{ padding: '0 20px 0 20px' }}>
                    <MGrid item>
                        <Icon name='user outline' style={{ color: '#FFF' }} /><sup style={{ color: '#FFF' }}>{' *'}</sup>
                        <Input style={{ width: '80%', color: 'white', marginLeft: 15 }} placeholder='Username or Email' name='username' onChange={onChangeUser} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </MGrid>
                    <br />
                    <MGrid item>
                        <Icon name='keyboard outline' style={{ color: '#FFF' }} /><sup style={{ color: '#FFF' }}>{' *'}</sup>
                        <Input icon={<Icon name={visiblity ? 'unhide' : 'hide'} link onClick={()=>{setVisiblity(!visiblity)}} />} autoComplete="off" style={{ width: '80%', color: 'white', marginLeft: 15 }} placeholder='Password' name='password' type={visiblity ? 'text' : 'password'} onChange={onChangePassword} onKeyPress={event => { if (event.key === 'Enter') { onSubmit() } }}></Input>
                    </MGrid>
                    <div className="loginValidation">
                        {loginDanger}
                    </div>
                </MGrid>
                <div style={{ float: 'right', display: 'inline', right: 0, color: 'white', cursor: 'pointer', marginBottom: 15, marginTop: 0 }} onClick={() => history.push('/forgotpassword')}>Forgot Password</div>
                <Button onClick={() => onSubmit()}>Log In</Button>
            </div>
        </React.Fragment>
    )
}

export default Login