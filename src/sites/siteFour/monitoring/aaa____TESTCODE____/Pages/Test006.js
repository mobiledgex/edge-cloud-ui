import React from "react";
import MuiVirtualizedTable from "./MuiVirtualizedTable";

export default class Test006 extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        for (let i = 0; i <= 2000; i += 1) {
            this.data.push({
                description: `Test ${i}!`,
                counter: i,
                lastActivity: "1/1/2018",
                createdAt: "1/1/2016"
            });
        }
    }

    rowGetter = ({index}) => this.data[index];

    render() {
        // the properties of each column are spread onto a react-virtualized Column component
        return (
            <div style={{flex: 1,}}>

                <MuiVirtualizedTable
                    rowHeight={800}
                    rowCount={this.data.length}
                    rowGetter={this.rowGetter}
                    style={{height: window.innerHeight, width: 350, overflowY: 'auto',}}
                    columns={[
                        {
                            width: 200,
                            flexGrow: 1.0,
                            label: "Description",
                            dataKey: "description"
                        },
                        {
                            width: 90,
                            label: "Counter",
                            dataKey: "counter",
                            numeric: true
                        },
                        {
                            width: 120,
                            flexGrow: 0.5,
                            label: "Last Activity",
                            dataKey: "lastActivity"
                        },
                        {
                            width: 120,
                            flexGrow: 0.5,
                            label: "Created",
                            dataKey: "createdAt"
                        }
                    ]}
                />
            </div>
        );
    }
}

