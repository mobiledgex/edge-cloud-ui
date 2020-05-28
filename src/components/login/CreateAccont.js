import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// semantic-ui
import { Container, Grid } from 'semantic-ui-react'

import CreateAccontForm from './CreateAccontForm'

class CreateAccont extends Component {

  render() {
    return (
      <Container className='create_acount' style={{ textAlign: 'center' }}>
        <Grid style={{ marginTop: 60 }}>
          <Grid.Column textAlign='right' width={16}>
            <Link to="/">Sign in</Link>
          </Grid.Column>
        </Grid>
        <CreateAccontForm />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps)(CreateAccont))
