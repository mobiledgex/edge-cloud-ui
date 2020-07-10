import React from 'react'
import { Tab, Menu } from 'semantic-ui-react';
import './style.css'
const MexCheckbox = (props) => {

    let form = props.form

    const getPanes = () => {
        return form.panes.map((pane, i) => {
            return { menuItem: <Menu.Item onClick={pane.onClick} key={i}><label style={{ color: '#FFF'}}>{pane.label}</label></Menu.Item>, render: () => <Tab.Pane>{pane.tab}</Tab.Pane> }
        })
    }
    const getForm = () => (
        <Tab
            menu={{ inverted: true, attached: true, tabular: true, color:'rgb(42, 44, 50)' }}
            activeIndex={props.activeIndex ? props.activeIndex : 0}
            panes={getPanes()}
            style={{ width: '100%', height: '100%'}} />
    )
    return (
        getForm()
    )
}
export default MexCheckbox