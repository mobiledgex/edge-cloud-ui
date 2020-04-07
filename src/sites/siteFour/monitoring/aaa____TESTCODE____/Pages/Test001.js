import {hot} from "react-hot-loader/root";
import React from 'react';
import {Bubble} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';

import {Menu, Dropdown} from 'antd';
import {Icon} from "semantic-ui-react";

type Props = {};
type State = {};


export default hot(
    class Test001 extends React.Component<Props, State> {

        render() {


            return (

                <div style={{height: 500, width: 1000}}>
                    <Dropdown
                        overlay={() => {

                            return (
                                <Menu>
                                    <Menu.Item
                                        key="1"
                                        onClick={() => {
                                            alert('sdlkfldkf')
                                        }}
                                    >
                                        <a href="http://www.taobao.com/">2nd menu item</a>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="1"
                                        onClick={() => {
                                            alert('sdlkfldkf')
                                        }}
                                    >
                                        <a href="http://www.taobao.com/">2nd menu item</a>
                                    </Menu.Item>
                                    <Menu.Item
                                        key="1"
                                        onClick={() => {
                                            alert('sdlkfldkf')
                                        }}
                                    >
                                        <a href="http://www.taobao.com/">2nd menu item</a>
                                    </Menu.Item>
                                </Menu>
                            )

                        }}
                        trigger={['click']}
                    >
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <Icon size='big' name='bars'/>
                        </a>
                    </Dropdown>
                </div>
            )
        }
    }
)




