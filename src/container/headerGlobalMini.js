import React from 'react';
import { Button, Icon, Label, Grid, Image, Popup } from 'semantic-ui-react';

import MaterialIcon, {colorPalette} from 'material-icons-react';
import { withRouter } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import ClockComp from '../components/clock';
import './styles.css';
import * as Service from "../services";

let _self = null;
class headerGlobalMini extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.onHandleClick = this.onHandleClick.bind(this);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            email: store ? store.email : 'Administrator'
        }
    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }
    gotoPreview(value) {
        //브라우져 입력창에 주소 기록
        let mainPath = value;
        let subPath = 'pg=0';
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    loginState() {
        //this.gotoPreview('/logout')

    }
    componentWillReceiveProps(nextProps, nextContext) {

        if(nextProps.user) {
            this.setState({email:nextProps.user.email})
        }
    }

    render() {
        const imageProps = {
            avatar: true,
            spaced: 'right',
            src: '/assets/avatar/avatar_default.svg',
        }

        return (
            <div className='intro_gnb_header'>
                <div className='navbar_right'>
                    <Popup
                        trigger={<div style={{cursor:'pointer'}}>
                            <Image src='/assets/avatar/avatar_default.svg' avatar />
                            <span>{this.state.email}</span>
                        </div>}
                        content={<Button content='Log out' onClick={() => this.gotoPreview('/logout')} />}
                        on='click'
                        position='bottom center'
                        className='gnb_logout'
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps ( {user} ) {
    return {
        user
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalMini));

///////
