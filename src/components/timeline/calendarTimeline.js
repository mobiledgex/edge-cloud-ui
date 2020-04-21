import React, { Component, useState } from "react";
import moment from "moment";

import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    CustomHeader
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import MaterialIcon from "material-icons-react";

var keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start",
    itemTimeEndKey: "end",
    groupLabelKey: "title"
};

export default class CalendarTimeline extends React.PureComponent {
    constructor(props) {
        super(props);

        const groups = this.generateGroupsData(props);
        const items = this.generateItemsData(groups);
        const defaultTimeStart = moment().startOf("hour").add(1, 'hour').toDate()
        const defaultTimeEnd = moment().startOf("hour").add(4, 'hour').toDate()
        const visibleTimeStart= moment().startOf("hour").add(0, 'hour').toDate()
        const visibleTimeEnd= moment().startOf("hour").add(5, 'hour').toDate()

        this.state = {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            visibleTimeStart,
            visibleTimeEnd,
            scrolling: true
        };
    }

    handleItemSelect = (itemId, _, time) => {
        let items = this.state.items;
        items.map(item => {
            if (item.id === itemId) {
                this.props.onItemSelectCallback(item.startDate, item.id);
            }
        });
    };

    handleClickCloseMap = (itemId, _, time) => {
        this.props.onItemClickCloseMap();
    };
    handleCanvasCloseMap = (itemId, _, time) => {
        this.props.onCanvasClickCloseMap();
    };

    generateGroupsData = props => {
        let statusList = props.timelineList.statusList;
        let tasksList = props.timelineList.tasksList;
        let groups = [];

        tasksList.map((tValue, tIndex) => {
            let renderValue = this.groupTitleRender(tValue);
            let groupsIndex = groups.findIndex(g => g.title === renderValue);
            if (groupsIndex === -1) {
                groups.push({
                    id: tIndex + 1,
                    title: renderValue,
                    border: "1px solid #db2828"
                });
            }
        });

        groups.map((gValue, gIndex) => {
            let status = false;
            tasksList.map((tValue, tIndex) => {
                let renderValue = this.groupTitleRender(tValue);
                if (gValue.title === renderValue) {
                    if (statusList[tIndex].status !== 200) {
                        status = true;
                    }
                }
            });
            groups[gIndex].status = status;
        });

        return groups;
    };

    groupTitleRender(value) {
        let renderValue = null;
        value = value.toLowerCase();

        if (value.indexOf("cloudletpool") > -1) {
            renderValue = "CloudletPool";
        } else if (value.indexOf("cloudlet") > -1) {
            renderValue = "Cloudlet";
        } else if (value.indexOf("cluster") > -1) {
            renderValue = "Cluster";
        } else if (value.indexOf("appinst") > -1) {
            renderValue = "AppInst";
        } else if (value.indexOf("flavor") > -1) {
            renderValue = "Flavor";
        } else if (value.indexOf("app") > -1) {
            renderValue = "App";
        } else if (value.indexOf("audit") > -1) {
            renderValue = "Audit";
        } else if (value.indexOf("login") > -1) {
            renderValue = "Login";
        } else if (value.indexOf("user") > -1) {
            renderValue = "User";
        } else {
            renderValue = "Other";
        }
        return renderValue;
    }

    getParseDate = item => {
        let parseDate = item;
        parseDate = moment(item, "YYYY-MM-DD HH:mm:ss");
        return parseDate;
    };
    generateItemsData = groups => {
        let status = this.props.timelineList.statusList;
        let items = [];
        this.props.timelineList.tasksList.map((tValue, tIndex) => {
            let renderValue = this.groupTitleRender(tValue);
            for (let i = 0; i < this.props.timelineList.tasksList.length; i++) {
                if (groups[i] !== undefined) {
                    if (groups[i].title === renderValue) {
                        this.props.timelineList.timesList.map((item, index) => {
                            const startDate = Date.parse(
                                this.getParseDate(item)
                            );
                            const startHour = Date.parse(
                                moment(item,"YYYY-MM-DD HH")
                            );
                            const startValue =
                                Math.floor(
                                    moment(startDate).valueOf() / 10000000
                                ) * 10000000;
                            const endValue = moment(
                                startDate + 250 * 60 * 1000
                            ).valueOf();
                            if (tIndex === index) {
                                items.push({
                                    id: index + "",
                                    group: groups[i].id + "",
                                    title: status[index].traceid,
                                    start: startHour,
                                    end: endValue,
                                    startDate: startDate,
                                    canMove: startValue > new Date().getTime(),
                                    canResize:
                                        startValue > new Date().getTime()
                                            ? endValue > new Date().getTime()
                                                ? "both"
                                                : "left"
                                            : endValue > new Date().getTime()
                                            ? "right"
                                            : false,
                                    className:
                                        status[index].status === 200
                                            ? "normal"
                                            : "error",
                                    bgColor: "#202329",
                                    selectedBgColor: "#202329",
                                    // itemTime: moment(item, "DD/MM/YY HH:mm:ss").format("DD/MM/YY HH:mm:ss"),
                                    itemTime: this.getParseDate(item).format("DD-MM-YY HH:mm:ss"),
                                    taskItem: tValue,
                                    borderColor:
                                        status[index].status === 200
                                        ? "#21ba45"
                                        : "#db2828",
                                    selectedBorderColor:
                                        status[index].status === 200
                                            ? "#21ba45"
                                            : "#db2828"
                                });
                            }
                        });
                    }
                }
            }
        });
        items = items.sort((a, b) => b - a);
        this.setState({ items: items });

        return items;
    };

    itemRenderer = ({
        item,
        itemContext,
        getItemProps,
        getResizeProps
    }) => {
        const {
            left: leftResizeProps,
            right: rightResizeProps
        } = getResizeProps();
        const backgroundColor = itemContext.selected
            ? itemContext.dragging
                ? "#db2828"
                : item.selectedBgColor
            : item.bgColor;
        const borderColor = itemContext.selected
            ? itemContext.resizing
                ? "#db2828"
                : item.borderColor
            : item.borderColor;
        const storageTimeList = JSON.parse(
            localStorage.getItem("selectedTime")
        );
        let storageTimeIndex = -1;
        if (storageTimeList) {
            storageTimeIndex = storageTimeList.findIndex(
                s => Date.parse(s) === this.getParseDate(item.itemTime).valueOf()
            );
        }

        const storageTraceList = JSON.parse(
            localStorage.getItem("sendedTraceid")
        );
        let storageTraceIndex = -1;
        if (storageTraceList) {
            storageTraceIndex = storageTraceList.findIndex(
                s => s === itemContext.title
            );
        }

        let properties = getItemProps();
        let additional = {};
        let customStyles = {
            ...properties.style,
            ...additional,
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1,
            lineHeight: "unset"
        };

        let newHeight = 0;
        newHeight = 74; //height of item
        customStyles.overflow = "hidden";
        customStyles.height = newHeight + "px";
        customStyles.minWidth = "20%";
        customStyles.maxWidth = "20%";
        customStyles.marginTop = "-10px";
        properties.style = customStyles;

        return (
            <div
                {...properties}
                className={"rct-item selected_" + itemContext.selected}
            >
                {itemContext.useResizeHandle ? (
                    <div {...leftResizeProps} />
                ) : null}

                <div className="timeline_item_box">
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <div style={{display:'flex', flex:1}}>{item.taskItem} ({item.itemTime})</div>
                        <div className="timeline_item_dot" style={{backgroundColor: borderColor}}>
                        {storageTimeIndex !== -1 ?
                        <span className="material-icons">done</span>
                        : null}
                        </div>
                    </div>
                    <div style={{width:'100%'}}>
                        <span style={{ fontWeight: 600, marginRight:10 }}>TRACE ID</span>{itemContext.title}
                    </div>
                    <div className="timeline_item_button">
                        <button
                            style={{ cursor: "pointer" }}
                            onClick={this.props.onPopupEmail}
                        >
                            Send E-mail Trace ID <span>{storageTraceIndex !== -1 ? <span style={{fontSize:12, width:14}} class="material-icons">done</span> : null}</span>
                        </button>
                    </div>
                </div>

                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : null}
            </div>
        );
    };

    groupRenderer = ({ group }) => {
        return (
            <div
                style={{ border: "1px solid #171A1F" }}
            >
                <div className="title">
                    {group.title}
                    <div style={{backgroundColor: group.status ? "#db2828" : "#21ba45" }} className="timeline_group_dot"> </div>
                </div>

            </div>
        );
    };

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.timelineList !== this.props.timelineList) {
            const { timelineList } = this.props;

            return { timelineList };
        }
    }

    componentDidMount() {
        let _self = this;
        setTimeout(() => _self.timeline.changeZoom(0.1), 500);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("20200416 snapshot = ", snapshot);
        if (snapshot) {
            let groups = this.generateGroupsData(snapshot);
            let items = this.generateItemsData(groups);
            const defaultTimeStart = moment().startOf("hour").add(1, 'hour').toDate()
            const defaultTimeEnd = moment().startOf("hour").add(4, 'hour').toDate()
            const visibleTimeStart= moment().startOf("hour").add(0, 'hour').toDate()
            const visibleTimeEnd= moment().startOf("hour").add(5, 'hour').toDate()

            this.setState ({
                groups,
                items,
                defaultTimeStart,
                defaultTimeEnd,
                visibleTimeStart,
                visibleTimeEnd,
                scrolling: true
            })
        }
    }

    onPrevClick = () => {
        const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
        this.setState(state => ({
            visibleTimeStart: state.visibleTimeStart - zoom,
            visibleTimeEnd: state.visibleTimeEnd - zoom,
            scrolling: true
        }));
    };

    onNextClick = () => {
        const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
        this.setState(state => ({
            visibleTimeStart: state.visibleTimeStart + zoom,
            visibleTimeEnd: state.visibleTimeEnd + zoom,
            scrolling: true
        }));
    };

    onCurrentClick = () => {
        this.setState({
            visibleTimeStart: moment().startOf("hour").add(0, 'hour').toDate(),
            visibleTimeEnd: moment().startOf("hour").add(5, 'hour').toDate(),
            scrolling: true
        });
    };

    handleTimeChange = (visibleTimeStart, visibleTimeEnd) => {
        this.setState({
            visibleTimeStart,
            visibleTimeEnd,
            scrolling: true
        });
    };

    render() {
        const {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            visibleTimeStart,
            visibleTimeEnd
        } = this.state;
        return (
            <div style={{ height: "100%" }}>
                <div>
                    <div className="timeline_button_layout">
                        <button
                            className="timeline_button_current"
                            onClick={this.onCurrentClick}
                        >
                            {"Current Time"}
                        </button>
                        <div className="timeline_button_arrow_box">
                            <button
                                className="timeline_button_arrow"
                                onClick={this.onPrevClick}
                            >
                                <MaterialIcon icon={"keyboard_arrow_left"} />
                            </button>
                            <button
                                className="timeline_button_arrow"
                                onClick={this.onNextClick}
                            >
                                <MaterialIcon icon={"keyboard_arrow_right"} />
                            </button>
                        </div>
                    </div>
                </div>
                <Timeline
                    ref={r => {this.timeline = r}}
                    groups={groups}
                    items={items}
                    keys={keys}
                    lineHeight={80} // size of vertical gap
                    canMove
                    canSelect
                    itemsSorted
                    itemTouchSendsClick={false}
                    minResizeWidth={200}
                    minZoom={60*60*1000*5}
                    maxZoom={60*60*1000*5}
                    stackItems
                    showCursorLine
                    minResizeWidth={550}
                    sidebarWidth={200}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    visibleTimeStart={visibleTimeStart}
                    visibleTimeEnd={visibleTimeEnd}
                    onTimeChange={this.handleTimeChange}
                    itemRenderer={this.itemRenderer}
                    groupRenderer={this.groupRenderer}
                    selected={[this.props.timelineSelectedIndex.toString()]}
                    onItemSelect={this.handleItemSelect}
                    onItemClick={this.handleClickCloseMap}
                    onCanvasClick={this.handleCanvasCloseMap}
                    style={{ height: "calc(100% - 32px)" }}
                >
                    <TimelineHeaders className="sticky">
                        <SidebarHeader>
                            {({ getRootProps }) => {
                                return (
                                    <div {...getRootProps()}>
                                        <div className="timeline_header_summary">
                                            <div className="timeline_header_summary_column">
                                                <div className="timeline_header_summary_label">
                                                    Normal
                                                </div>
                                                <div className="timeline_header_summary_normal">
                                                    {
                                                        this.props
                                                            .statusCount[0]
                                                            .normalCount
                                                    }
                                                </div>
                                            </div>
                                            <div className="timeline_header_summary_column">
                                                <div className="timeline_header_summary_label">
                                                    Error
                                                </div>
                                                <div className="timeline_header_summary_error">
                                                    {
                                                        this.props
                                                            .statusCount[0]
                                                            .errorCount
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </SidebarHeader>
                        <CustomHeader className="custom-header" height={50} width="200px !important" headerData={{someData: 'data'}} unit="hour">
                            {({
                                  headerContext: { intervals },
                                  getRootProps,
                                  getIntervalProps
                              }) => {
                                return (
                                    <div className="timeline_header_date" {...getRootProps()}>
                                        {intervals.map(interval => {
                                            const intervalStyle = {
                                                width: '170px !important',
                                                lineHeight: '30px',
                                                textAlign: 'center',
                                                borderLeft: '1px solid white',
                                                cursor: 'pointer',
                                                backgroundColor: '#202329',
                                                color: 'white',
                                            }
                                            return (
                                                <div
                                                    {...getIntervalProps({
                                                        interval,
                                                        style: setTimeout(() => intervalStyle , 2000)
                                                    })}
                                                >
                                                    <div className="sticky">
                                                        {interval.startTime.format('YYYY-MM-DD HH:mm:SS')}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            }}
                        </CustomHeader>
                    </TimelineHeaders>
                </Timeline>
            </div>
        );
    }
}
