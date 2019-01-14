import React from 'react';
import { Button, Icon, Label, Grid, Image } from 'semantic-ui-react';

import MaterialIcon, {colorPalette} from 'material-icons-react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import ClockComp from '../components/clock';
import './styles.css';

let _self = null;
class HeaderGlobal extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.onHandleClick = this.onHandleClick.bind(this);
    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }
    gotoPreview(value) {
        //브라우져 입력창에 주소 기록
        let mainPath = '/site1';
        let subPath = 'pg=0';
        this.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

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
                <Grid.Column width={6}>
                    <div className='title_top' />
                </Grid.Column>
                <Grid.Column width={5} className='navbar_right'>
                    <div style={{cursor:'pointer'}} onClick={() => this.gotoPreview()}>
                        <MaterialIcon icon={'public'} />
                    </div>
                    <div>
                        <MaterialIcon icon={'notifications_none'} />
                    </div>
                    <div>
                        <Image src='/assets/avatar/avatar_default.svg' avatar />
                        <span>Administrator</span>
                    </div>
                    <div>
                        <span>Support</span>
                    </div>
                </Grid.Column>
            </Grid>
        )
    }
}


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default withRouter(connect(null, mapDispatchProps)(HeaderGlobal));

///////
