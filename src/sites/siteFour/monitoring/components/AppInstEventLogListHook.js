import * as React from 'react';
import {useEffect, useState} from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import '../PageMonitoring.css'

type Props = {
    eventLogList: any,
    columnList: any,
    parent: PageDevMonitoring,
};

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}


export default function AppInstEventLogListHook(props) {
    //const [eventLogList, setEventLogList] = useState([]);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);


    return (
        <div>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <div className='page_monitoring_title draggable'
                     style={{
                         flex: 1,
                         marginTop: 10,
                         fontFamily: 'Ubuntu',
                     }}
                >
                    App Inst Event Log
                </div>


            </div>
            <TableContainer component={Paper}
                            style={{
                                height: 220,
                                fontFamily: 'Ubuntu',
                                backgroundColor: 'blue !important',
                                width: 'auto',
                                overflowX: 'scroll'
                            }}>
                <Table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll'}}
                       stickyHeader={true}>

                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Ubuntu',}} fixedHeader={true}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{}}>
                                TIME
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                App
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                Event[Status]
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody style={{width: 'auto', overflowX: 'scroll'}}>
                        {props.eventLogList.map((item, index) => (
                            <TableRow key={index}
                                      style={{
                                          backgroundColor: index % 2 === 0 ? '#1e2025' : '#23252c',
                                          color: 'grey',
                                          height: 10,
                                      }}>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {item[0].toString().split('T')[0]}
                                    </div>
                                    <div>
                                        {item[0].toString().split('T')[1].substring(0, 8)}
                                    </div>
                                </TableCell>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>

                                    {windowDimensions.width <= 1440 ?
                                        <React.Fragment>
                                            <div>
                                                {item[1].toString().substring(0, 15)}

                                            </div>
                                            <div>
                                                {item[1].toString().substring(15, item[1].toString().length)}
                                            </div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <div>
                                                {item[1].toString().substring(0, 20)}

                                            </div>
                                            <div>
                                                {item[1].toString().substring(20, item[1].toString().length)}
                                            </div>
                                        </React.Fragment>
                                    }

                                </TableCell>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {item[9]}
                                    </div>
                                    <div>
                                        [{item[10]}]
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
};
