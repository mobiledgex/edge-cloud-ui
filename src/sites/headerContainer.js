import React from 'react';
import { Grid, Tab, Modal, Header } from 'semantic-ui-react';
import { ScaleLoader } from 'react-spinners';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import {withRouter} from "react-router-dom";

import Styles from './styles';

const panes = [
    { menuItem: '하이패스 모니터링', render: () => <div></div> },
    { menuItem: 'CCTV 모니터링', render: () => <div></div> },
    { menuItem: '교통량 현황', render: () => <div></div> },
    { menuItem: '카드관리 현황', render: () => <div></div> },
    { menuItem: '기상정보', render: () => <div></div> },
    { menuItem: '차로 설비 상태', render: () => <div></div> },
]
let self = null;
class HeaderContainer extends React.Component {
    constructor() {
        super();
        self = this;
        this.state = {
            open: false,
            lastTabIndex: 0
        }
    }


    handleChange(e, object) {
        /**
         * 비디오가 있을경우 모두 멈춘 후 탭을 이동해야 함
         */

        console.log('last tab index == '+self.state.lastTabIndex)
        if(self.state.lastTabIndex === 0 || self.state.lastTabIndex === 1) {
            self.props.handleStopVideo('stop')
            setTimeout(() => {
                self.setState({open: false})
                //self.props.handleInjectData(null);
                self.props.handleChangeTab(object.activeIndex);
            }, 1000)
            self.setState({open: true})
        } else {
            //self.props.handleInjectData(null);
            self.props.handleChangeTab(object.activeIndex);
        }
        self.setState({lastTabIndex: object.activeIndex});

        //브라우져 입력창에 주소 기록
        self.props.siteName.subPath = 'pg='+object.activeIndex;
        self.props.history.push({
            pathname: self.props.siteName.mainPath,
            search: self.props.siteName.subPath,
            state: { some: 'state' }
        });
        self.props.history.location.search = self.props.siteName.subPath;
        self.props.handleChangeSite({mainPath:self.props.siteName.mainPath, subPath: `pg=${object.activeIndex}`})

    }

    render() {
        return (
            <Grid.Row style={Styles.containerHeader}>
                <Grid.Column>

                </Grid.Column>
            </Grid.Row>
        )
    }
}
const mapStateToProps = (state) => {
    console.log('tab -- '+state.tabChanger.tab)

    let tab = state.tabChanger.tab;
    return {
        tabName: tab,
        siteName: state.siteChanger.site
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleStopVideo: (data) => { dispatch(actions.stopVideo(data))},
        handleClickTab: (data) => { dispatch(actions.clickTab(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))},
        handleInjectData: (data) => { dispatch(actions.clearData(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(HeaderContainer));
