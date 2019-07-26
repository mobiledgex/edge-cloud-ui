import React from 'react';
import {Dropdown} from 'semantic-ui-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

class DropdownFilter extends React.Component {
    constructor() {
        super()
        this.state = {
            showItem:false,
            tableHeaders:[]
        }
        this.holding = false;
    }
    selectFilter = (a, {name, value}) => {
        if(!this.holding){
            this.setState({showItem: !this.state.showItem})
        } else {
            this.holding = false;
        }
    }
    onBlur = (a,b) => {
    }
    onFocus = (a, b) => {
    }
    selectFilterItem = (a, {name, value}) => {
        this.holding = true;
        /**
         * should receive headerlist from redux state with tableHeaders
         *
         */



        let changeState = [];
        this.state.tableHeaders.map((header) => {
            if(header.name === name) {
                header.hidden = !header.hidden
                this.props.handleSavestateFilters(header)
            }
        })

        //TEST -- will remove after test
        //////////////////////////////////
        this.setState({tableHeaders:this.state.tableHeaders})
        ///////////////////////////////////



    }
    componentWillReceiveProps(nextProps, nextContext) {
        //set filters
        this.setState({showItem:false})
        if(nextProps.tableHeaders) {
            this.setState({tableHeaders:nextProps.tableHeaders})
        }
        if(nextProps.openFilter) {
            this.setState({showItem:nextProps.openFilter})
        }
    }
    componentWillUnmount() {
        this.holding = false;
        this.setState({showItem:false})
    }

    render() {
        return (
            <Dropdown text='Filter' icon='filter' labeled button multiple onClick={this.selectFilter}
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
            >
                {
                    (this.state.showItem)?
                        <Dropdown.Menu>
                            {
                                this.state.tableHeaders.map((item, i) => (
                                    <Dropdown.Item icon={(!item.hidden)?'eye':'eye slash outline'} text={item.name} name={item.name} value={item.name} onClick={this.selectFilterItem}/>
                                ))
                            }
                        </Dropdown.Menu>
                        :
                        null
                }

            </Dropdown>
        )
    }
}
const mapStateToProps = (state) => {

    return {
        tableHeaders : (state.tableHeader)? state.tableHeader.headers : null
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleSavestateFilters: (data) => { dispatch(actions.saveStateFilter(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(DropdownFilter);
