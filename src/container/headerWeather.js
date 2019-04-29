import React from 'react';
import { Segment, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';

const headerStyle = {
    backgroundImage: 'url()'
}

class HeaderWeather extends React.Component {
    constructor(props) {
        super(props);
        this.onHandleClick = this.onHandleClick.bind(this);
    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }

    render() {
        return (

            <div style={ headerStyle }>

                    <Header textAlign='center' style={{fontSize:20, color:'#fff'}}>
                        <Image
                            src='./assets/images/main_logo.png'
                            as='a'
                            style={{width:'80px', height:'20px'}}
                            href='/'
                            target='_self'
                        />
                        <Header.Content>
                            {this.props.title}
                        </Header.Content>
                    </Header>

            </div>
        )
    }
}

//get state in this scope : null
// const mapStateToProps = (state) => {
//     return {
//         siteName: state.siteChanger.site,
//     };
// };

//set props in this scope....and dispatch event action
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},

    };
};

export default connect(null, mapDispatchProps)(HeaderWeather);

///////
