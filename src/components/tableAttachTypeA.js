import React, { Component } from 'react'
import { Table, Icon } from 'semantic-ui-react'
import { ScaleLoader } from 'react-spinners';

const header = (titles, data, divi) => (
    <Table.Header compact textAlign='center'>
        <Table.Row>
            <Table.HeaderCell className='headerRightBorder' colSpan={(divi) ? divi[0].length+1 : 1} rowSpan='2' textAlign="center" fullWidth={true}>{titles[0]}</Table.HeaderCell>
            <Table.HeaderCell className='headerSubCompact' colSpan={(divi) ? divi[1].length   : 1} textAlign="center" fullWidth={true}>{titles[1]}</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
            {
                (data && data.subHeader) ? data.subHeader.titles.map((sbHead, i) => (
                    <Table.HeaderCell className='headerSubCompact' textAlign='center' colSpan={data.subHeader.values[i]}>{sbHead}</Table.HeaderCell>
                )) : null
            }
        </Table.Row>
    </Table.Header>
)
const header2 = (datas) => {
    if(datas){
        return datas.header.map((value, i) => (
            <Table.Cell width={1} textAlign='center'>{value}</Table.Cell>
        ))
    } else {
        return null
    }
}
const makeCell = (datas, type, icon, divi, title) => {
    if(type == 'A'){
        return datas.map((value, i) => (
            <Table.Cell textAlign='center'  className={(i === divi[0].length-1) ? 'headerRightBorder' : 'no'}>
                {(value === '-') ? '-' : <Icon name={(value == 'DISCONNECT') ? icon[1] : icon[0]} size='large'/>}
            </Table.Cell>
        ))
    } else if(type == 'B'){
        return datas.map((value, i) => (
            <Table.Cell textAlign='center'  className={(i === divi[0].length-1) ? 'headerRightBorder' : 'no'}>
                {(value === '-') ? '-' : <Icon color={(value == '녹색') ? 'green' : (value == '적색') ? 'red' : 'green'} name={(value == '녹색') ? icon[0] : icon[1]} size='large' />}
            </Table.Cell>
        ))
    } else if(type == 'C'){
        return datas.map((value, i) => (
            <Table.Cell textAlign='center'  className={(i === divi[0].length-1) ? 'headerRightBorder' : 'no'}>
                {(value == '비근무') ?
                    (value === '-') ? '-' : <Icon color={'blue'} name={icon} size='large' />
                : value}
            </Table.Cell>
        ))
    } else if(type == 'D'){
        return datas.map((value, i) => (
            <Table.Cell className={(i === divi[0].length-1) ? 'headerRightBorder' : "Negative"} textAlign='center' negative={(value == '미등록') ? true : false}>
                {(i > divi[0].length-1 && title === '교통카드') ?'-':value}
            </Table.Cell>
        ))
    }
}
const getKey =function(obj) { //single
    let keyName;
    for(var key in obj) {
        keyName = key;
    }
    return keyName;
}
const rows = (datas, divi) => {
    if(datas){
        return datas.rows.map((data, i) => (
            (i == 0) ?
            <Table.Row>
                <Table.Cell>{data.title}</Table.Cell>
                {makeCell(data.value, 'A', ['recycle', 'recycleRed'], divi)}
            </Table.Row>
            : (i == 1) ?
            <Table.Row>
                <Table.Cell>{data.title}</Table.Cell>
                {makeCell(data.value, 'B', ['arrow down', 'close'], divi)}
            </Table.Row>
            : (i == 2) ?
            <Table.Row>
                <Table.Cell>{data.title}</Table.Cell>
                {makeCell(data.value, 'C', 'male', divi)}
            </Table.Row>
            :
            <div />

        ))
    } else {
        return (
            <Table.Row className="loadingBox">
                <Table.Cell colSpan='2' style={{textAlign:'center'}}>
                    <ScaleLoader
                        color={'#185ea7'}
                        loading={true}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }
}
const footer = (datas, divi) => {
    if(datas){
        return datas.footer.map((data, i) => (
            <Table.Row className="cellasFooter">
                <Table.Cell>{data.title}</Table.Cell>
                {makeCell(data.value, 'D', 'negative', divi, data.title)}
            </Table.Row>
        ))
    } else {
        return (
        <Table.Row className="cellasFooter">
            <Table.Cell colSpan='2' style={{textAlign:'center'}}>
                <ScaleLoader
                    color={'#185ea7'}
                    loading={true}
                />
            </Table.Cell>
        </Table.Row>
        )
    }
}
const body = (data, divi) => (
    <Table.Body>
        <Table.Row className="cellasHeader">
            {header2(data)}
        </Table.Row>
        {rows(data, divi)}
    </Table.Body>
)

class TableAttached extends Component {
    state = {
        active : true,
        data:null
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data) this.setState({active: false, data:nextProps.data})
    }
    render() {
        const props = this.props;
        return (
            <div className="tableA" style={{marginBottom: '5px'}}>
                <Table celled compact={'very'}>{header(props.title, this.state.data, props.division)}{body(this.state.data, props.division)}{footer(this.state.data, props.division)}</Table>
            </div>
        )
    }
}



export default TableAttached
