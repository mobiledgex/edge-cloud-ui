import React, {useState} from 'react'
import '../../css/components/dualListbox/react-dual-listbox.css'
import DualListBox from 'react-dual-listbox';
import {Icon} from "semantic-ui-react";
const MexDualList = (props) => {
    let form = props.form;
    
    const [selected, setSelected] = useState([]);
    const onSelected = (data)=>
    {
        setSelected(data)
        props.onChange(form, data)
    }
    

    return (
        <DualListBox
            icons={{
                moveLeft: <Icon name="angle left" />,
                moveAllLeft: [
                    <Icon key={0} name="angle double left" />,
                ],
                moveRight: <Icon name="angle right" />,
                moveAllRight: [
                    <Icon key={0} name="angle double right" />,
                ],
                moveDown: <span className="fa fa-chevron-down" />,
                moveUp: <span className="fa fa-chevron-up" />,
            }}
            canFilter
            selected = {selected}
            options={form.options ? form.options : []}
            onChange = {onSelected}
        />
    )
}
export default MexDualList