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

let _self = null;
export default class CalendarTimeline extends React.PureComponent {
    constructor(props) {
        super(props);
        _self = this;
        this.sameTime = '0';

        const groups = this.generateGroupsData(props);
        const items = this.generateItemsData(groups);
        const defaultTimeStart = this.makeUTCDateTime(moment(), "hour", -4);
        const defaultTimeEnd = this.makeUTCDateTime(moment(), "hour", 1);
        const visibleTimeStart= this.makeUTCDateTime(moment(), "hour", -4);
        const visibleTimeEnd= this.makeUTCDateTime(moment(), "hour", 1);

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

    makeUTCDateTime = (time, type, add) => {
        let momentTime = moment(time);
        let newTime = moment(momentTime).utc().format('YYYY/MM/DD HH:mm:ss:SSS');
        if(type){
            return moment(newTime, "YYYY-MM-DD HH:mm:ss").startOf(type).add(add, type).toDate();
        }
        return moment(newTime, "YYYY-MM-DD HH:mm:ss")
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
        this.props.onItemClickCloseMap()
    };

    handleCanvasCloseMap = (itemId, _, time) => {
        this.props.onCanvasClickCloseMap()
    };

    generateGroupsData = props => {
        let groups = [];

        groups.push({
            id: 1,
            title: ""
        });

        return groups;
    };

    getParseDate = item => {
        let parseDate = item;
        parseDate = moment(item, "YYYY-MM-DD HH:mm:ss");
        return parseDate;
    }

    generateItemsData = groups => {
        let timelineList = this.props.timelineList
        if(timelineList){
            let statusList = timelineList.statusList;
            let tasksList = timelineList.tasksList;
            let timesList = timelineList.timesList;
            let items = [];

            tasksList.map((tValue, tIndex) => {
                const startDate = this.getParseDate(timesList[tIndex]);
                const startHour = moment(timesList[tIndex],"YYYY-MM-DD HH");
                const endValue = moment(startDate).valueOf();
                items.push({
                    id: tIndex + "",
                    group: groups[0].id + "",
                    title: statusList[tIndex].traceid,
                    start: startHour,
                    end: endValue,
                    startDate: startDate,
                    className:
                        statusList[tIndex].status === 200
                            ? "normal"
                            : "error",
                    bgColor: "#202329",
                    selectedBgColor: "#202329",
                    // itemTime: moment(item, "DD/MM/YY HH:mm:ss").format("DD/MM/YY HH:mm:ss"),
                    itemTime: this.getParseDate(timesList[tIndex]).format("HH:mm:ss"),
                    taskItem: tValue,
                    borderColor:
                        statusList[tIndex].status === 200
                            ? "#05CE00"
                            : "#CE0000",
                    selectedBorderColor:
                        statusList[tIndex].status === 200
                            ? "#05CE00"
                            : "#CE0000"
                });
            });

            items = items.sort((a, b) => b - a);
            this.setState({ items: items });

            return items;
        }
        return null;
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
        const storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"));
        let storageSelectedTraceidIndex = -1;
        if (storageSelectedTraceidList) {
            storageSelectedTraceidIndex = storageSelectedTraceidList.findIndex(
                s => s === item.title
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
        newHeight = 48; //height of item
        customStyles.overflow = "hidden";
        customStyles.height = newHeight + "px";
        customStyles.minWidth = "calc(20% - 10px)";
        customStyles.maxWidth = "calc(20% - 10px)";
        customStyles.marginLeft = "3px";
        customStyles.marginTop = "-5px";
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
                    <div className="timeline_item_text">
                        <div>{item.taskItem} ({item.itemTime})</div>
                        <div><span style={{ fontWeight: 600, marginRight: 10 }}>TRACE ID</span>{item.title}</div>
                    </div>
                    <div className="timeline_item_dot" style={{borderColor: borderColor, backgroundColor: storageSelectedTraceidIndex !== -1 ? borderColor : 'transparent'}} />
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
                    <div style={{ backgroundColor: group.status ? "#db2828" : "#21ba45" }} className="timeline_group_dot"> </div>
                </div>

            </div>
        );
    };

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.timelineList !== this.props.timelineList) {
            const { timelineList } = this.props;

            return { timelineList };
        }
        return null;
    }

    componentDidMount() {
        let _self = this;
        setTimeout(() => {
            if (_self && _self.timeline) {
                _self.timeline.changeZoom(0.1)
            }
        }, 500)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            let groups = this.generateGroupsData(snapshot);
            let items = this.generateItemsData(groups);
            let defaultTimeStart = this.makeUTCDateTime(moment(), "hour", -4);
            let defaultTimeEnd = this.makeUTCDateTime(moment(), "hour", 1);
            let visibleTimeStart= (snapshot.timelineList.current)?this.makeUTCDateTime(moment(), "hour", -4):this.state.visibleTimeStart;
            let visibleTimeEnd= (snapshot.timelineList.current)?this.makeUTCDateTime(moment(), "hour", 1):this.state.visibleTimeEnd;

            this.setState({
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
        if (this.state.visibleTimeEnd + zoom <= moment(this.state.defaultTimeEnd).valueOf()) {
            this.setState(state => ({
                visibleTimeStart: state.visibleTimeStart + zoom,
                visibleTimeEnd: state.visibleTimeEnd + zoom,
                scrolling: true
            }));
        } else {
            this.setState({
                visibleTimeStart: this.makeUTCDateTime(moment(), "hour", -4),
                visibleTimeEnd: this.makeUTCDateTime(moment(), "hour", 1),
                scrolling: true
            });
        }
    };

    onHourPrevClick = () => {
        const zoom = 60 * 60 * 1000;
        this.setState(state => ({
            visibleTimeStart: state.visibleTimeStart - zoom,
            visibleTimeEnd: state.visibleTimeEnd - zoom,
            scrolling: true
        }));
    };

    onHourNextClick = () => {
        const zoom = 60 * 60 * 1000;
        if (this.state.visibleTimeEnd + zoom <= moment(this.state.defaultTimeEnd).valueOf()) {
            this.setState(state => ({
                visibleTimeStart: state.visibleTimeStart + zoom,
                visibleTimeEnd: state.visibleTimeEnd + zoom,
                scrolling: true
            }));
        } else {
            this.setState({
                visibleTimeStart: this.makeUTCDateTime(moment(), "hour", -4),
                visibleTimeEnd: this.makeUTCDateTime(moment(), "hour", 1),
                scrolling: true
            });
        }
    };

    handleTimeChange = (visibleTimeStart, visibleTimeEnd) => {
        if (parseInt(visibleTimeEnd) <= moment(this.state.defaultTimeEnd).valueOf()) {
            this.setState({
                visibleTimeStart,
                visibleTimeEnd,
                scrolling: true
            });
        }
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
            <div style={{ height: "100%", position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, zIndex: 1000, width: '100%' }}>
                    <div className="timeline_button_layout">
                        <div className="timeline_button_arrow_box">
                            <div>
                                <button
                                    className="timeline_button_arrow  double"
                                    onClick={this.onPrevClick}
                                >
                                    <MaterialIcon icon={"fast_rewind"} />
                                </button>
                                <button
                                    className="timeline_button_arrow"
                                    onClick={this.onHourPrevClick}
                                >
                                    <MaterialIcon icon={"arrow_left"} />
                                </button>
                            </div>
                            <div>
                                <button
                                    className="timeline_button_arrow"
                                    onClick={this.onHourNextClick}
                                >
                                    <MaterialIcon icon={"arrow_right"} />
                                </button>
                                <button
                                    className="timeline_button_arrow double"
                                    onClick={this.onNextClick}
                                >
                                    <MaterialIcon icon={"fast_forward"} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Timeline
                    ref={r => { this.timeline = r }}
                    groups={[]}
                    items={[]}
                    keys={keys}
                    lineHeight={60} // size of vertical gap
                    canMove
                    canSelect
                    itemsSorted
                    itemTouchSendsClick={false}
                    minResizeWidth={200}
                    minZoom={60 * 60 * 1000 * 6}
                    maxZoom={60 * 60 * 1000 * 6}
                    stackItems
                    showCursorLine
                    minResizeWidth={550}
                    sidebarWidth={0}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    visibleTimeStart={visibleTimeStart}
                    visibleTimeEnd={visibleTimeEnd}
                    onTimeChange={this.handleTimeChange}
                    itemRenderer={this.itemRenderer}
                    groupRenderer={this.groupRenderer}
                    selected={[]}
                    onItemSelect={this.handleItemSelect}
                    onItemClick={this.handleClickCloseMap}
                    onCanvasClick={this.handleCanvasCloseMap}
                    style={{ height: "100%" }}
                >
                    <TimelineHeaders className="sticky">
                        <CustomHeader className="custom-header" height={50} headerData={{ someData: 'data' }} unit="hour">
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
                                                        style: setTimeout(() => intervalStyle, 2000)
                                                    })}
                                                >
                                                    <div className="sticky"
                                                         style={{color:(interval.startTime.format('YYYY-MM-DD HH:mm:SS') === this.makeUTCDateTime(moment()).format('YYYY-MM-DD HH:00:00')) ? '#92DF18' : "rgba(255,255,255,.6)"}}
                                                    >
                                                        {interval.startTime.format('YYYY-MM-DDTHH:mm')}(UTC)
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