import React from "react";
import {WidthProvider, Responsive} from "react-grid-layout";
import _ from "lodash";
import {reactLocalStorage} from "reactjs-localstorage";
import {hot} from "react-hot-loader/root";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {};
type State = {
    newCounter: number,
    items: any,
    cols: number,

};

export default hot(
    class Test003 extends React.Component<Props, State> {
        static defaultProps = {
            className: "layout",
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            rowHeight: 100
        };

        constructor(props) {
            super(props);

            /* let defaultLayout= [0, 1, 2, 3, 4].map(function (i, key, list) {
                 return {
                     i: i.toString(),
                     x: i * 2,
                     y: 0,
                     w: 2,
                     h: 2,
                     add: i === (list.length - 1)
                 };
             })*/

            let defaultLayout = [
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

            console.log("defaultLayout===>", defaultLayout);


            this.state = {
                items: defaultLayout,
                newCounter: 0,
                cols: 6,
            };
        }

        createElement(el) {
            const i = el.add ? "+" : el.i;
            return (
                <div key={i} data-grid={el} style={{margin: 5, backgroundColor: 'green'}}>
                    <span className="text">{i}</span>
                    <span
                        className="remove"
                        onClick={this.onRemoveItem.bind(this, i)}
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

        onAddItem() {

            let cols = this.state.items.length
            //alert(cols)

            console.log("adding", "n" + this.state.newCounter);
            this.setState({
                // Add a new item. It must have a unique key!
                items: this.state.items.concat({
                    i: "n" + this.state.newCounter,
                    //x: (this.state.items.length * 2) % (this.state.cols || 12),
                    x: cols % 3,
                    y: Infinity, // puts it at the bottom
                    w: 1,
                    h: 1
                }),
                // Increment the counter to ensure key is always unique.
                newCounter: this.state.newCounter + 1
            });
        }

        // We're using the cols coming back from this to calculate where to add new items.
        onBreakpointChange(breakpoint, cols) {
            this.setState({
                breakpoint: breakpoint,
                cols: cols
            });
        }


        onRemoveItem(i) {
            console.log("removing", i);

            let removedList = _.reject(this.state.items, {i: i});

            this.setState({
                items: removedList,
            });
        }

        render() {
            return (
                <div style={{backgroundColor: 'blue'}}>
                    <button onClick={() => {
                        this.onAddItem()
                    }} style={{color: 'blue'}}>Add Item
                    </button>
                    <ResponsiveReactGridLayout
                        onLayoutChange={(layout) => {

                            reactLocalStorage.setObject('layout007')

                            this.setState({layout: layout});
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
