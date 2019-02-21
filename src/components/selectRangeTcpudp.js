import React from 'react';
import {Dropdown} from "semantic-ui-react";


class SelectRangeTcpudp extends React.Component {
    render() {
        let props = this.props;
        return (
            <div className='panel_filter_inline'>
                <div className='filter'>
                    <Dropdown placeholder='Select Cluster' fluid search selection
                              options={props.optionOne} wrapSelection={true}
                              value={props.dropdownValueOne}
                              onChange={(e, {value}) => props.handleChange({id:props.sid, key:'drop_0', value:value})}
                    />
                </div>
                <div className='filter'>
                    <Dropdown placeholder='Select Application' fluid search selection
                              options={props.optionTwo} wrapSelection={true}
                              value={props.dropdownValueTwo}
                              onChange={() => props.handleChange({id:props.sid, key:'drop_1'})}
                    />
                </div>
                <div className='filter'>
                    <Dropdown placeholder='Last Hour' fluid search selection
                              options={props.optionFour} wrapSelection={true}
                              value={props.dropdownValueFour}
                              onChange={() => props.handleChange({id:props.sid, key:'drop_3'})}
                    />
                </div>
            </div>
        )


    }
}
export default SelectRangeTcpudp;
