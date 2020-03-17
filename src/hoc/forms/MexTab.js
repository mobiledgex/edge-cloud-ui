import React from 'react'
import { Tab, Menu } from 'semantic-ui-react';
const MexCheckbox = (props) => {

    let form = props.form

    const getPanes = () => {
        return form.panes.map(pane => {
            return { menuItem: <Menu.Item><label style={{color:'#74AA19'}}>{pane.label}</label></Menu.Item>, render: () => <Tab.Pane>{pane.tab}</Tab.Pane> }
        })
    }
    const getForm = () => (
        <Tab
            menu = {{color:'#26272C', inverted:'true', attached:'true', tabular:'true'}}  
            panes={getPanes()} 
            style={{ width: '100%', height:'100%'}} />
    )
    return (
        getForm()
    )
}
export default MexCheckbox