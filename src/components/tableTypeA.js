import React, { Component } from 'react';
import { Header, Table, Rating, Dropdown, Container } from 'semantic-ui-react';
import * as d3 from 'd3';
import { ScaleLoader } from 'react-spinners';

//text foramt    http://bl.ocks.org/mstanaland/6106487
/*
Starting number: 1500
d3.format(",") : 1,500
d3.format(".1f") : 1500.0
d3.format(",.2f") : 1,500.00
d3.format("s") : 1.5k
d3.format(".1s") : 2k
d3.format(".2s") : 1.5k
function(d) { return "$" + d3.format(",.2f")(d); } : $1,500.00
d3.format(",.2%") : 150,000.00%
*/
const formatComma = d3.format(",");
const formatPercent = d3.format(".2f",".2f");
const getHeader = (datas) => {
    if(datas){
        return datas.header.map((value, i) => (
            <Table.Cell textAlign='center'>{value}</Table.Cell>
        ))
    } else {
        return(
        <Table.Cell textAlign='center'>Loading...</Table.Cell>
        )
    }
}
const makeCell = (datas, type) => {
    if(datas){
        if(type == 'A') {
            return datas.value.map((value, i) => (
                <Table.Cell className="pink" textAlign='right'>{(value !== '-') ? formatComma(value) : value}</Table.Cell>
            ))
        } else if(type === 'B'){
            return datas.value.map((value, i) => (
                <Table.Cell className="green" textAlign='right' fontWeight='bold'>{(value !== '-') ? formatComma(value) : value}</Table.Cell>
            ))
        } else {
            return datas.value.map((value, i) => (
                <Table.Cell textAlign='right'>{(value !== '-') ? formatComma(value) : value}</Table.Cell>
            ))
        }
    }
}
const getTableFooter = (datas) => {
    if(datas && datas.footer){
        let length = datas.footer.length;
        return datas.footer.map((data, i) => (
            <Table.Row>
                <Table.Cell className={
                        (i === 0) ? "sky"
                        : "pink"} textAlign='right'
                >
                    {data.title}
                </Table.Cell>
                {data.value.map((data, j) => (
                    <Table.Cell className={
                        (i === 0) ? "sky"
                            : "pink"} textAlign='right'
                    >
                        {(data !== '-' && i === 0) ? formatPercent(data) : (data !== '-' && i === 1) ? formatComma(data) : data}
                    </Table.Cell>
                ))}
            </Table.Row>

        ))

    }
}
const getTableRow = (datas) => {
    var rows = null;
    if(datas) {
        rows = datas.rows.map( (datas, i) => (

            <Table.Row>
                <Table.Cell textAlign='right' className={(datas.title === "전체")?'green':null}>{datas.title}</Table.Cell>
                {makeCell(datas, (datas.title === "전체")? 'B':'')}
            </Table.Row>

        ));
    }

    return rows;
}


const trafficTable = (data) => (
    <Table celled padded className='very-compact typeA' attached='middle'>
        <Table.Body>
            <Table.Row className="cellasHeader">{getHeader(data)}</Table.Row>
            {getTableRow(data)}
            {getTableFooter(data)}
        </Table.Body>
    </Table>
)
const displayLoader = () => (
    <Container className='loadingBox'>
        <ScaleLoader
            color={'#185ea7'}
            loading={true}
        />
    </Container>
)
class TableTrafficMount extends Component {
    state = {
        data:null
    }
    componentWillReceiveProps (nextProps) {
        console.log('receive props ==>>>>>>>'+JSON.stringify(nextProps))
        if(nextProps.data){
            this.setState({data:nextProps.data})
        }
    }
    render () {
        return (
            <div className="tableA">
                <Header size='huge' attached='top'>
                    {this.props.title}
                </Header>

                {(this.state.data) ? trafficTable(this.state.data) : displayLoader()}

            </div>
        )
    }
}







export default TableTrafficMount;
