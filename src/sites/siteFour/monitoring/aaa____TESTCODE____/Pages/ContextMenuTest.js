import React from 'react';
import {animation, Item, Menu, MenuProvider, theme} from 'react-contexify';
import './contextmenu.css'

type Props = {};
type State = {};

export default class ContextMenuTest extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <div style={{margin: 50}}>
                    <MenuProvider id="context1" style={{border: '1px solid purple', display: 'inline-block'}}>
                        Right click me...
                    </MenuProvider>
                    <ContextMenu1/>
                </div>
            </div>
        );
    };
};

const onClick = ({event, props}) => {
    alert('sdlfksdlkflskdflk')
};

// create your menu first
const ContextMenu1 = () => (
    <Menu id='context1' theme={theme.dark} animation={animation.pop}>
        <Item onClick={onClick} style={{color: 'white'}}>Lorem</Item>
        <Item onClick={onClick} style={{color: 'white'}}>Lorem2</Item>
        <Item onClick={onClick} style={{color: 'white'}}>Lorem3</Item>
        <Item onClick={onClick} style={{color: 'white'}}>Lorem4</Item>
    </Menu>
);
