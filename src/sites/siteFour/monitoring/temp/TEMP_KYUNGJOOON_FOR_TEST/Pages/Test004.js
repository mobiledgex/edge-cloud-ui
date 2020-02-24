import React from "react";
import {WidthProvider, Responsive} from "react-grid-layout";
import _ from "lodash";
import {reactLocalStorage} from "reactjs-localstorage";
import {hot} from "react-hot-loader/root";
import {isEmpty} from "../../../PageMonitoringCommonService";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const defaultLayout = [
    {
        "i": "0", "x": 0, "y": 0, "w": 1, "h": 1, "add": false
    },
    {
        "i": "1", "x": 1, "y": 0, "w": 1, "h": 1, "add": false
    },
    {
        "i": "2", "x": 2, "y": 0, "w": 1, "h": 1, "add": false
    },
    {
        "i": "3", "x": 0, "y": 1, "w": 1, "h": 1, "add": false
    },
    {
        "i": "4", "x": 1, "y": 1, "w": 1, "h": 1, "add": false
    },
    {
        "i": "5", "x": 2, "y": 1, "w": 1, "h": 1, "add": true
    }
]
type Props = {};
type State = {
    newCounter: number,
    items: any,
    cols: number,

};


export default hot(
    class Test004 extends React.Component<Props, State> {
        static defaultProps = {
            className: "layout",
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            rowHeight: 100
        };

        constructor(props: Props) {
            super(props);


            let savedLayout = reactLocalStorage.getObject('l007')


            console.log("defaultLayout===>", defaultLayout);
            this.state = {
                items: isEmpty(savedLayout) ? defaultLayout : savedLayout,
                newCounter: 0,
                cols: 6,
            };
        }

        createElement(el) {
            const index = el.i;
            return (
                <div key={index} data-grid={el} style={{margin: 5, backgroundColor: 'green'}}>
                    <span className="text">{index}</span>
                    <span
                        className="remove"
                        onClick={() => {
                            this.removeItem(index)
                        }}
                        style={{
                            fontSize: 25,
                            width: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            //backgroundColor: 'red',
                            position: "absolute",
                            right: "2px",
                            top: 0,
                            fontWeight: 'bold',
                            cursor: "pointer"
                        }}
                    >
                    x
                    </span>
                </div>
            );
        }

        makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        async onAddItem() {
            let cols = this.state.items.length

            console.log("items===>", this.state.items)

            let currentItems = this.state.items;

            let maxY = _.maxBy(currentItems, 'y').y;

            const newIndex = Number(_.maxBy(currentItems, "i").i) + 1;


            console.log("newIndex===>", newIndex);


            await this.setState({
                // Add a new item. It must have a unique key!
                items: this.state.items.concat({
                    i: this.makeid(5),
                    //x: (this.state.items.length * 2) % (this.state.cols || 12),
                    x: 0,
                    y: maxY + 1, //
                    w: 1,
                    h: 1
                }),
                // Increment the counter to ensure key is always unique.
                newCounter: this.state.newCounter + 1
            });
            reactLocalStorage.setObject('l007', this.state.items)
        }

        // We're using the cols coming back from this to calculate where to add new items.
        onBreakpointChange(breakpoint, cols) {
            this.setState({
                breakpoint: breakpoint,
                cols: cols
            });
        }


        removeItem(i) {
            console.log("removing", i);

            let removedLayout = _.reject(this.state.items, {i: i});
            reactLocalStorage.setObject('l007', removedLayout)
            this.setState({
                items: removedLayout,
            });
        }

        render() {
            return (
                <div style={{backgroundColor: 'blue'}}>
                    <button onClick={() => {
                        this.onAddItem()
                    }} style={{color: 'blue'}}>Add Item
                    </button>
                    <button onClick={async () => {
                        reactLocalStorage.remove('l007')

                    }} style={{color: 'blue'}}>delete lo
                    </button>
                    <ResponsiveReactGridLayout
                        onLayoutChange={(layout) => {

                            reactLocalStorage.setObject('l007', layout)

                            this.setState({
                                layout: layout,
                                cols: layout.length,
                            });
                        }}
                        onBreakpointChange={() => {
                            this.onBreakpointChange();
                        }}
                    >
                        {this.state.items.map(el => {

                            return this.createElement(el)
                        })}
                    </ResponsiveReactGridLayout>
                </div>
            );
        }
    }
)
