import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { connect } from "react-redux";
import HeaderComponent from "../hooks/header";
import * as actions from "../../../../actions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ToolBoxItem extends React.Component {
    render() {
        return (
            <div
                className="toolbox__items__item"
                onClick={this.props.onTakeItem.bind(undefined, this.props.item)}
            >
                {this.props.item.i}
            </div>
        );
    }
}
class ToolBox extends React.Component {
    render() {
        return (
            <div className="toolbox">
                <span className="toolbox__title" style={{ display: "none" }}>Toolbox</span>
                <div className="toolbox__items">
                    {this.props.items.map(item => (
                        <ToolBoxItem
                            key={item.i}
                            item={item}
                            onTakeItem={this.props.onTakeItem}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

class MonitoringLayout extends React.Component {
    static defaultProps = {
        className: "layout",
        rowHeight: 30,
        onLayoutChange() { },
        cols: {
            lg: 12, md: 10, sm: 6, xs: 4, xxs: 2
        },
        initialLayout: generateLayout()
    };

    constructor(props) {
        super(props);
        this.state = {
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: false,
            layouts: { lg: props.initialLayout },
            toolbox: { lg: [] },
            headerSize: 30,
            padding: 3,
        };
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }



    onBreakpointChange = breakpoint => {
        this.setState(prevState => ({
            currentBreakpoint: breakpoint,
            toolbox: {
                ...prevState.toolbox,
                [breakpoint]:
                    prevState.toolbox[breakpoint]
                    || prevState.toolbox[prevState.currentBreakpoint]
                    || []
            }
        }));
    };

    onCompactTypeChange = () => {
        const { compactType: oldCompactType } = this.state;
        const compactType = oldCompactType === "horizontal"
            ? "vertical"
            : oldCompactType === "vertical"
                ? null
                : "horizontal";
        this.setState({ compactType });
    };

    onTakeItem = item => {
        this.setState(prevState => ({
            toolbox: {
                ...prevState.toolbox,
                [prevState.currentBreakpoint]: prevState.toolbox[
                    prevState.currentBreakpoint
                ].filter(({ i }) => i !== item.i)
            },
            layouts: {
                ...prevState.layouts,
                [prevState.currentBreakpoint]: [
                    ...prevState.layouts[prevState.currentBreakpoint],
                    item
                ]
            }
        }));
    };

    onPutItem = item => {
        this.setState(prevState => ({
            toolbox: {
                ...prevState.toolbox,
                [prevState.currentBreakpoint]: [
                    ...(prevState.toolbox[prevState.currentBreakpoint]
                        || []),
                    item
                ]
            },
            layouts: {
                ...prevState.layouts,
                [prevState.currentBreakpoint]: prevState.layouts[
                    prevState.currentBreakpoint
                ].filter(({ i }) => i !== item.i)
            }
        }));
    };

    onLayoutChange = (layout, layouts) => {
        this.props.onLayoutChange(layout, layouts);
        this.setState({ layouts });
    };

    onNewLayout = () => {
        this.setState({
            layouts: { lg: generateLayout() }
        });
    };

    onClickMenu = (info, title) => {
        this.props.handleClickPanelInfo({ info, title });
    }

    generateDOM(items) {
        return this.state.layouts[this.state.currentBreakpoint].map(
            (l, idx) => (
                <div
                    key={l.i}
                    className={l.static ? "page_monitoring_layout_column static" : "page_monitoring_layout_column cancelDrageBar"}
                    style={{
                        display: "grid",
                        gridTemplateRows: "30px auto",
                    }}

                >
                    {/* progress bar in here */}
                    <HeaderComponent
                        style={{ height: this.state.headerSize }}
                        defaultProps={l.i}
                        onPutItem={this.onPutItem}
                        onClick={this.onClickMenu}
                        idx={l}
                        panelInfo={items[idx].props}
                    />
                    <div
                        style={{
                            padding: "10px",
                            backgroundColor: "#202329"
                        }}
                    >
                        {items[idx]}
                    </div>
                </div>
            )
        );
    }

    render() {
        const { toolbox, currentBreakpoint, layouts } = this.state;
        return (
            <div>
                <ToolBox
                    items={
                        toolbox[currentBreakpoint] || []
                    }
                    onTakeItem={this.onTakeItem}
                />

                <ResponsiveReactGridLayout
                    className="layout page_monitoring_layout_dev"
                    {...this.props}
                    layouts={layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    // WidthProvider option
                    measureBeforeMount
                    // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                    // and set `measureBeforeMount={true}`.
                    useCSSTransforms={this.state.mounted}
                    compactType={this.state.compactType}
                    preventCollision={!this.state.compactType}
                    // autoSize
                    // cols : If size of width reduced then compact the sizing and arange items in vertical
                    cols={{
                        lg: 12, md: 3, sm: 3, xs: 3, xxs: 2
                    }}
                    rowHeight={(this.props.sizeInfo.height - 90) / 3} // TODO : value 70 is maby height of header
                    draggableHandle=".react-grid-dragHandleExample"
                >
                    {this.generateDOM(this.props.items)}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}

//
const mapStateToProps = (state, ownProps) => ({
    not: null
});
const mapDispatchProps = dispatch => ({
    handleClickPanelInfo: data => {
        dispatch(actions.clickInfoPanel(data));
    }
});

export default connect(mapStateToProps, mapDispatchProps)(MonitoringLayout);


function generateLayout() {
    return _.map(_.range(0, 25), function (item, i) {
        const y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: (_.random(0, 5) * 2) % 12,
            y: Math.floor(i / 6) * y,
            w: 2,
            h: y,
            i: i.toString(),
            static: Math.random() < 0.05
        };
    });
}

/** **
 * // layout is an array of objects, see the demo for more complete usage
    const layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </GridLayout>
    )
 */
