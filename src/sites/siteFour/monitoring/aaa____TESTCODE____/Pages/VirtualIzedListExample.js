import React from "react";
import {FixedSizeList} from "react-window";
import {hot} from "react-hot-loader/root";
import "./styles.css";
import {Table} from "semantic-ui-react";

import './../../../../../../css/index.css'

type Props = {};
type State = {};

const {Row, Cell, Body, Header, HeaderCell} = Table


export default hot(
    class VirtualIzedListExample extends React.Component<Props, State> {


        render() {

            let gridHeight = 500
            let gridWidth = 700;

            let datas=['slfksf', '234lk32lk4d__', 'slfksdlkf', 'slfksdlkfl__', 'kyungjoogo', 'sfdlksfslkf_ykungjoon33', 'lskdlfksdlfk', 'sdlkfslkdflskdlfk']

            return (
                <div style={{height: gridHeight, backgroundColor: 'grey', width: gridWidth}}>
                    <table>
                        <thead>
                        <th className='page_monitoring_popup_table_row'>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                            <td style={{width: 150, height: 50, textAlign: 'center', backgroundColor: '#414141', color: 'white'}}>
                                sdfsdf
                            </td>
                        </th>
                        </thead>
                        <Body style={{width: gridWidth}}>
                            <FixedSizeList
                                className="List"
                                height={gridHeight}
                                itemCount={datas.length}
                                itemSize={50}
                                style={{backgroundColor: 'black', display: 'flex', overFlowY: 'auto'}}
                                width={gridWidth}
                            >
                                {({index, style}) => {
                                    return (

                                        <tr className='page_monitoring_popup_table_row' style={style}>
                                            <td style={{width: 200, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                               {datas[index]}
                                            </td>
                                            <td style={{width: 150, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                                asdasdasd
                                            </td>
                                            <td style={{width: 150, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                                asfasdfasdfasd
                                            </td>
                                            <td style={{width: 150, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                                123123123123
                                            </td>
                                            <td style={{width: 150, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                                asfsdfasdf
                                            </td>
                                            <td style={{width: 150, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                                {index}
                                            </td>
                                        </tr>

                                    )
                                }}

                            </FixedSizeList>
                        </Body>
                    </table>

                </div>
            );
        };
    }
)
