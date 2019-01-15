import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import InstanceListView from '../container/instanceListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageTwo extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            activeItem: 'Developers'
        };
        this.headerH = 70;
        this.hgap = 0;
    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <InstanceListView></InstanceListView>

        );
    }

};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default withRouter(connect(null, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageTwo)));