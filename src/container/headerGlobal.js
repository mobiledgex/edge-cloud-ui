import React from 'react';
import { Button, Grid, Image, Popup } from 'semantic-ui-react';

import MaterialIcon from 'material-icons-react';
import { withRouter } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './styles.css';

let _self = null;
class HeaderGlobal extends React.Component {
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
            <Grid className='console_gnb_header'>
                <Grid.Column width={5}></Grid.Column>
                <Grid.Column width={6} className='console_header'>
                    <div className='console_header_img'></div>
                </Grid.Column>
                <Grid.Column width={5} className='navbar_right'>
                    <div style={{cursor:'pointer'}} onClick={() => this.gotoPreview('/site1')}>
                        <MaterialIcon icon={'public'} />
                    </div>
                    <div>
                        <MaterialIcon icon={'notifications_none'} />
                    </div>
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

                    <div>
                        <span>Support</span>
                    </div>
                </Grid.Column>
            </Grid>
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(HeaderGlobal));

///////
