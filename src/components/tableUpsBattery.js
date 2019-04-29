import React from 'react';
import { Table, Container, Icon, Popup, Grid, Header } from 'semantic-ui-react';
import * as d3 from 'd3';
import { ScaleLoader } from 'react-spinners';
import ImageFilter from 'react-image-filter';

//text foramt    http://bl.ocks.org/mstanaland/6106487
//image filter   https://github.com/Stanko/react-image-filter

const formatComma = d3.format(",");
const colorLevel = [[156,166,188],[235,232,0],[235,88,0],[214,34,34]];
const batteryImgs = ['/assets/icon_battery_full.png','/assets/icon_battery_warning.png','/assets/icon_battery_critical.png'];
const subHeader = (datas) => (

    <Table.Header>
      <Table.Row textAlign='center' className='cellasHeaderGray'>
        {datas.map((value) => (
            <Table.HeaderCell fullWidth={true}>{value}</Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>

)
const makeIcon = (icon, value) => (
    <Icon color={
        (value == '0') ? 'green' :
        (value == '1') ? 'yellow' :
        (value == '2') ? 'orange' :
        (value == '3') ? 'red' : 'green'
    } name={icon} size={30} />
)
const compared = (value, limit) => {
    var comp = colorLevel[0];
    if(value < limit[0]) {
        comp = colorLevel[0];
    } else if(value >= limit[0] && value < limit[1]) {
        comp = colorLevel[2];
    } else if(value >= limit[1]) {
        comp = colorLevel[3];
    }

    return comp;
}
const compareInner = (value, limit) => {
    var comp = colorLevel[0];
    if(value <= limit[0] || value >= limit[1]) {
        comp = colorLevel[3];
    }

    return comp;
}
const compareReverse = (value, limit) => {
    var comp = colorLevel[0];
    if(value > limit[1]) {
        comp = colorLevel[0];
    } else if(value <= limit[1] && value > limit[0]) {
        comp = colorLevel[2];
    } else if(value <= limit[0]) {
        comp = colorLevel[3];
    }

    return comp;
}
const compareReverseImg = (value, limit) => {
    let comp = batteryImgs[0];
    if(value > limit[1]) {
        comp = batteryImgs[0];
    } else if(value <= limit[1] && value > limit[0]) {
        comp = batteryImgs[1];
    } else if(value <= limit[0]) {
        comp = batteryImgs[2];
    }

    return comp;
}

const makeImageColor = (image, value, limit, condi) => (
    <ImageFilter
        image={condi === 'reverse' ? compareReverseImg(value, limit) : image}
        filter={'duotone'}
        colorOne={condi === 'reverse' ? compareReverse(value, limit) : (condi === 'inner') ? compareInner(value, limit) : compared(value , limit)}
        colorTwo={condi === 'reverse' ? compareReverse(value, limit) : (condi === 'inner') ? compareInner(value, limit) : compared(value , limit)}
        style={{width:37, height:22, display:'inline-block'}}
    />
)
const makeImage = (image) => (
    <img src={image} />
)
const makeImageStatusColor = (image, value) => (
    <ImageFilter
        image={image}
        filter={'duotone'}
        colorOne={colorLevel[value]}
        colorTwo={colorLevel[value]}
        style={{width:37, height:22, display:'inline-block'}}
    />
)
const factoryCell = (datas) => (
    datas.map((data, i) => (
        <Table.Row textAlign='center'>
            {data.value.map((value, j) => (
                <Table.Cell key={i}><h2>{(i == 0) ? makeIcon(value, 0) : value}</h2></Table.Cell>
            ))}
        </Table.Row>
    ))

)
const makePopup = (value, ranges) => (
    <Popup
        trigger={<div className='valueCurr'>{value[0]}</div>}
        inverted
        flowing
        hoverable
        style={{width:280}}
    >
        <Grid centered divided columns={2}>
            <Grid.Column textAlign='center'>
                <Header as='h4'>{ranges[0]}</Header>
                <p>{value[1]}</p>
            </Grid.Column>
            <Grid.Column textAlign='center'>
                <Header as='h4'>{ranges[1]}</Header>
                <p>{value[2]}</p>
            </Grid.Column>
        </Grid>
    </Popup>
)
const fmsTable = (datas) => (
    <Table celled structured>
        <Table.Header className='UPStitle'>
            <Table.Row>
                <Table.HeaderCell rowSpan='2' textAlign='center'>구분</Table.HeaderCell>
                <Table.HeaderCell colSpan='2' textAlign='center'>본관</Table.HeaderCell>
                <Table.HeaderCell colSpan='2' textAlign='center'>인천공항</Table.HeaderCell>
                <Table.HeaderCell colSpan='2' textAlign='center'>북인천</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell textAlign='center' className="mainF">메인</Table.HeaderCell>
                <Table.HeaderCell textAlign='center' className="subF">보조</Table.HeaderCell>
                <Table.HeaderCell textAlign='center' className="mainF">메인</Table.HeaderCell>
                <Table.HeaderCell textAlign='center' className="subF">보조</Table.HeaderCell>
                <Table.HeaderCell textAlign='center' className="mainF">메인</Table.HeaderCell>
                <Table.HeaderCell textAlign='center' className="subF">보조</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell className='division'>출력상태</Table.Cell>
                {datas.rows[0][datas.colName[0]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImage((value.curr === "onLine") ? '/assets/icon_power_on.png':'/assets/icon_power_off.png')} <div className='valueCurr'>{(value.curr === "onLine") ? "ON" : "OFF"}</div>
                    </Table.Cell>
                ))}
            </Table.Row>
            <Table.Row>
                <Table.Cell className='division'>배터리상태</Table.Cell>
                {datas.rows[1][datas.colName[1]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImageStatusColor('/assets/icon_battery_full.png', (value.curr === "batteryNormal")?0:3)} <div className='valueCurr'>{(value.curr === "batteryNormal") ? "정상" : "불량"}</div>
                    </Table.Cell>
                ))}
            </Table.Row>
            <Table.Row>
                <Table.Cell className='division'>배터리 잔류량(%)</Table.Cell>
                {datas.rows[2][datas.colName[2]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImageColor('/assets/icon_battery_full.png',
                            value.curr, [value.critical1, value.major1], 'reverse')}
                        {makePopup([value.curr, value.critical1, value.major1], ['CRITICAL', 'MAJOR'])}
                    </Table.Cell>
                ))}
            </Table.Row>
            <Table.Row>
                <Table.Cell className='division'>온도(℃)</Table.Cell>
                {datas.rows[3][datas.colName[3]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImageColor('/assets/icon_temper_battery.png',value.curr, [value.major1, value.critical1])}
                        {makePopup([value.curr, value.major1, value.critical1], ['MAJOR', 'CRITICAL'])}
                    </Table.Cell>
                ))}
            </Table.Row>
            <Table.Row>
                <Table.Cell className='division'>입력전압(V)</Table.Cell>
                {datas.rows[4][datas.colName[4]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImageColor('/assets/icon_thunder_battery.png',value.curr, [value.critical1, value.critical2], 'inner')}
                        {makePopup([value.curr, value.critical1, value.critical2], ['CRITICAL1', 'CRITICAL2'])}
                    </Table.Cell>
                ))}
            </Table.Row>
            <Table.Row>
                <Table.Cell className='division'>출력부하(%)</Table.Cell>
                {datas.rows[5][datas.colName[5]].map((value, i) => (
                    <Table.Cell className='subCell' key={i}>
                        {makeImageColor('/assets/icon_percent_battery.png',value.curr, [value.major1, value.critical1])}
                        {makePopup([value.curr, value.major1, value.critical1], ['MAJOR', 'CRITICAL'])}
                    </Table.Cell>
                ))}
            </Table.Row>
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
const TableUpsBattery = (props) => (

        (props.data) ? fmsTable(props.data) : displayLoader()

)

export default TableUpsBattery;
