import * as types from '../actions/ActionTypes';

function user (state = {}, action) {

  switch (action.type) {

    case types.LOGIN_WITH_EMAIL :
    
      const { login_token, user } = action.params

      return {
        ...state,
        login_token: login_token,
        user: user,
      }

    default :
      return state
  }
}

export default user
