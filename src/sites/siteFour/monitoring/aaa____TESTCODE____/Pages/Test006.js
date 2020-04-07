import React from "react";
import '../../../../../css/index.css'
import "./styles.css";
import {Table} from 'antd';

type Props = {};
type State = {};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];
/*
const tableCSS = css({
    margin: '40px 120px',
    //backgroundColor: 'white',
    '& table': {
        borderCollapse: 'collapse'
    },
    '& thead > tr > th': {
        backgroundColor: 'darkblue',
        color: 'white',
    },
    '& thead > tr': {
        backgroundColor: 'grey',
        borderColor: 'grey',
        //borderStyle: 'solid'
    },
    '& thead : hover': {
        borderWidth: '-1px',
        backgroundColor: 'grey',
        borderColor: 'grey',
        //borderStyle: 'solid'
    }
});
*/

export default class Test006 extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <h4>Small size table</h4>
                <Table
                    //className={tableCSS}
                    columns={columns}
                    dataSource={data}
                    size="small"
                />
            </div>

        );
    };
};
