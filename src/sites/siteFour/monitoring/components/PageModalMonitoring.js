// @flow
import * as React from 'react';
import {Button} from "antd";
import {hot} from "react-hot-loader/root";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import sizeMe from "react-sizeme";
import * as actions from "../../../../actions";


const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        }
    };
};

type Props = {};
type State = {};
export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageModalMonitoring extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props)
        }

        render() {
            return (
                <div style={{display: 'flex', flex: 1, margin: 100}}>

                    <Button style={{backgroundColor: 'green'}} onClick={() => {
                        this.props.history.goBack();
                    }}>
                        goBack
                    </Button>
                    <div>
                        고경준 천재님임fsdlkflsdkflsdk
                    </div>
                </div>
            );
        };
    }
))));
