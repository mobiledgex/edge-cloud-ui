import React from 'react';
import { Header, Table, Icon, Container } from 'semantic-ui-react';
import { ScaleLoader } from 'react-spinners';
import styles from "./styles";


/*
<Table.Header>
      <Table.Row textAlign='center' className='cellasHeader'>
          {datas.map((value, i) => (
              (value.multi) ?
                  <Table.HeaderCell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.HeaderCell>
              :
                  <Table.HeaderCell>{value}</Table.HeaderCell>
          ))}
      </Table.Row>
    </Table.Header>
 */

const makeRows = (datas) => (

    <Table.Row>
        <Table.Cell textAlign='center' colSpan='2' style={styles.leftColumnGrey}>{datas.title}</Table.Cell>

        <Table.Cell textAlign='center'>
            {(datas.value[0]) ? datas.value[0] : ''}
        </Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[1]) ? datas.value[1] : ''}</Table.Cell>
        <Table.Cell style={styles.leftColumnBorder} textAlign='center'>{(datas.value[2]) ? datas.value[2] : ''}</Table.Cell>

        <Table.Cell textAlign='center'>
            {(datas.value[3]) ? datas.value[3] : ''}
        </Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[4]) ? datas.value[4] : ''}</Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[5]) ? datas.value[5] : ''}</Table.Cell>
    </Table.Row>


)
const makeMultiClmRow = (datas, main, sub) => (

    <Table.Row>
        {(main !== null) ? <Table.Cell rowSpan='2' style={styles.leftColumnGrey}>{main}</Table.Cell> : null}
        <Table.Cell textAlign='center' style={styles.leftColumnGrey}>{sub}</Table.Cell>

        <Table.Cell textAlign='center' >
            {(datas.value[0]) ? datas.value[0] : ''}
        </Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[1]) ? datas.value[1] : ''}</Table.Cell>
        <Table.Cell style={styles.leftColumnBorder} textAlign='center'>{(datas.value[2]) ? datas.value[2] : ''}</Table.Cell>

        <Table.Cell textAlign='center'>
            {(datas.value[3]) ? datas.value[3] : ''}
        </Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[4]) ? datas.value[4] : ''}</Table.Cell>
        <Table.Cell textAlign='center'>{(datas.value[5]) ? datas.value[5] : ''}</Table.Cell>
    </Table.Row>

)
const trafficTable = (datas) => (

    <Table celled structured attached className='very-compact'>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='2' style={styles.topHeader}>진출입로</Table.HeaderCell>
                <Table.HeaderCell colSpan='3' style={styles.topHeader}>공항방향</Table.HeaderCell>
                <Table.HeaderCell colSpan='3' style={styles.topHeader}>서울방향</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell colSpan='2' style={styles.headerRowDark}>IC</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDark}>진입</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDark}>본선</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDarkPoint}>진출</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDark}>진입</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDark}>본선</Table.HeaderCell>
                <Table.HeaderCell style={styles.headerRowDark}>진출</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {makeRows(datas.rows[0])}
            {makeRows(datas.rows[1])}
            {makeRows(datas.rows[2])}
            {makeMultiClmRow(datas.rows[3], '노오지 JTC', "판교")}
            {makeMultiClmRow(datas.rows[4], null, "일산")}
            {makeRows(datas.rows[5])}
            {makeRows(datas.rows[6])}
            {makeRows(datas.rows[7])}
            {makeRows(datas.rows[8])}
            {makeRows(datas.rows[9])}
            {makeMultiClmRow(datas.rows[10], '신도시 IC', "송도")}
            {makeMultiClmRow(datas.rows[11], null, "신도시")}
            {makeRows(datas.rows[12])}
        </Table.Body>
    </Table>

)
const dynamicAttributes = (attribute, value) => {
    let opts = {};
    if( typeof value !== 'undefined' && value !== null) {
        opts[attribute] = value;
        return opts;
    }
    return false;
}
const factorySubHeader = (datas) => (
    (datas) ?
        <Table.Row textAlign='center' className='cellasHeaderGray'>
            {datas.map((value, i) => (
                (value.multi) ?
                    <Table.HeaderCell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.HeaderCell>
                :
                    <Table.HeaderCell>{value}</Table.HeaderCell>
            ))}
        </Table.Row>
    :
        null


)

const makeValue = (value) => (
    (value == 'off') ?
        <Icon color={'red'} name={'close'} size='mini' />
    : (value == 'on') ?
        <Icon color={'green'} name={'arrow down'} size='mini' />
    :
    value
)
const factoryRows = (rowdatas) => {
    if(rowdatas) {
        let row = rowdatas.map((data, i)=>(
            <Table.Row>

                {(data.title.title) ?
                    <Table.Cell {...dynamicAttributes(data.title.multi.key, data.title.multi.value)}>
                        {data.title.title}
                    </Table.Cell>
                : <Table.Cell>{data.title}</Table.Cell>
                }

                {
                    data.value.map((value) => (
                        (value.multi) ?
                            <Table.Cell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.Cell>
                        :
                            <Table.Cell>{makeValue(value)}</Table.Cell>
                        )
                    )
                }

            </Table.Row>
        ));
        return row;
    } else {
        return <Table.Row>{"Loading...."}</Table.Row>
    }

}
const trafficTableBk = (datas) => (
    <Table celled structured attached className='tableB very-compact'>
        {(datas) ? factorySubHeader(datas.subHeader) : null}
        <Table.Body>
            {
                (datas) ?
                    factoryRows(datas.rows)
                :
                <Table.Row>
                    <Table.Cell textAlign='right'>Loading</Table.Cell>
                </Table.Row>
            }
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

const TableTrafficMount = (props) => (
        <div className="tableA">
            <Header size='huge' attached='top'>
                {props.title}
            </Header>

            {(props.data) ?
                trafficTable(props.data)
                :
                displayLoader()
            }

        </div>
)

export default TableTrafficMount;
