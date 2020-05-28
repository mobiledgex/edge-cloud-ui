import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

// semantic-ui
import { Container, Form, Input, Button, Grid, Select } from 'semantic-ui-react'

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'
import * as Action from '../../actions'

import Alert from 'react-s-alert';

class CreateAccontForm extends Component {

  state = {
    email: '',
    password: '',
    role: ''
  }

  onSubmit = () => {

    const { email, password, role } = this.state

    const params = {
      email: email,
      password: password,
      role: role
    }

    // create account
    MyAPI.createAccount(params)
    .then((data) => {
      // save account

      // success
      const params = {
        user: data.user,
        login_token: data.login_token
      }

      localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))

      this.props.mapDispatchToLoginWithPassword(params)

    })
    .then(() => {
      // redirect
      this.props.history.push("/")
    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err, {
        position: 'top-right',
        effect: 'slide',
        timeout: 20000
      });
    })
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  render() {

    const { email, password } = this.state

    //rest api 데이터 연동 예정(현재 http통신 X)
    const roleOptions = [
      {
        key: 'MEXADMIN',
        text: 'MEXADMIN',
        value: 'MEXADMIN'
      },
      {
        key: 'Developer Manager',
        text: 'Developer Manager',
        value: 'Developer Manager'
      },
      {
        key: 'Developer Contributor',
        text: 'Developer Contributor',
        value: 'Developer Contributor'
      },
      {
        key: 'Developer Viewer',
        text: 'Developer Viewer',
        value: 'Developer Viewer'
      },
      {
        key: 'Operator Manager',
        text: 'Operator Manager',
        value: 'Operator Manager'
      },
      {
        key: 'Operator Contributor',
        text: 'Operator Contributor',
        value: 'Operator Contributor'
      },
      {
        key: 'Operator Viewer',
        text: 'Operator Viewer',
        value: 'Operator Viewer'
      },
    ]

    return(
      <Container text className='create_acount_form'>


        <Form onSubmit={this.onSubmit} style={{marginTop:60}}>
          <Grid>

            <Grid.Column textAlign='left' width={16}>
              <label>Email</label>
              <Input
                style={{width: '100%'}}
                icon='mail outline'
                iconPosition='left'
                name='email'
                onChange={this.handleChange}
                value={email}
                placeholder='yourname@example.com' />
            </Grid.Column>

            <Grid.Column textAlign='left' width={16}>
              <label>Password</label>
              <Input
                style={{width: '100%'}}
                icon='key'
                iconPosition='left'
                name='password'
                onChange={this.handleChange}
                value={password}
                placeholder='********' />
            </Grid.Column>
            <Grid.Column textAlign='left' width={16}>
              <label>Role</label>
              <Select
                placeholder='role'
                name='role'
                style={{width: '100%'}}
                options = {roleOptions}
                onChange={this.handleChange} />
            </Grid.Column>
            <Grid.Column width={16}>
              <Button
                style={{width: '100%'}}
                loading={this.state.loading}
                disabled={this.state.loading}
                type='submit'>Create an account</Button>
            </Grid.Column>


          </Grid>

        </Form>

      </Container>
    )
  }
}

// react-redux
function mapStateToProps ( {user} ) {
  return {
    user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    mapDispatchToLoginWithPassword: (data) => dispatch(Action.loginWithEmailRedux({ params: data})),
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps, mapDispatchToProps )(CreateAccontForm) )
