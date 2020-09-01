import React from 'react'
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader
} from 'react-calendar-timeline'
import "react-calendar-timeline/lib/Timeline.css";
import { Button, IconButton } from '@material-ui/core'
import '../../../../../node_modules/react-calendar-timeline/lib/Timeline.css'
import * as dateUtil from '../../../../utils/date_util'
import RefreshIcon from '@material-ui/icons/Refresh';
import './style.css'

const keys = {
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


const endRange = dateUtil.endOfDay().valueOf()
const startRange = dateUtil.subtractDays(30, endRange).valueOf()

class CalendarTimeline extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visibleTimeStart: startRange,
            visibleTimeEnd: endRange
        }
    }

    handleTimeChangeSecond = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        this.setState({ visibleTimeStart, visibleTimeEnd })
    };

    onReset = () => {
        this.setState({ visibleTimeStart: startRange, visibleTimeEnd: endRange })
    }

    itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
        const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
        const backgroundColor = itemContext.selected ? (itemContext.dragging ? "red" : item.selectedBgColor) : item.bgColor;
        const borderColor = itemContext.resizing ? "red" : item.color;
        return (
            <div
                style={{height:20}}
                {...getItemProps({
                    style: {
                        backgroundColor,
                        color: '#FFF',
                        borderRadius:4,
                        border:'none',
                        borderLeftWidth: itemContext.selected ? 3 : 1,
                        borderRightWidth: itemContext.selected ? 3 : 1
                    },
                    onMouseDown: () => {
                        console.log("on item click", item);
                    }
                })}
            >
                {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

                <div
                    style={{
                        height: itemContext.dimensions.height,
                        overflow: "hidden",
                        paddingLeft: 3,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {itemContext.title}
                </div>

                {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
            </div>
        );
    }

    render() {
        return (
            <div style={{ height: 'calc(100% - 0px)', overflow: 'auto', backgroundColor: '#1E2123', padding: 10 }}>
                <IconButton aria-label="refresh" onClick={this.onReset}>
                    <RefreshIcon style={{ color: '#76ff03' }} />
                </IconButton>
                <Timeline
                    scrollRef={el => (this.scrollRef = el)}
                    groups={this.props.groupList}
                    items={this.props.dataList}
                    keys={keys}
                    sidebarWidth={150}
                    canMove={false}
                    canResize="right"
                    canSelect={false}
                    itemsSorted
                    itemTouchSendsClick={false}
                    stackItems
                    lineHeight={60}
                    itemHeightRatio={0.50}
                    visibleTimeStart={this.state.visibleTimeStart}
                    visibleTimeEnd={this.state.visibleTimeEnd}
                    onTimeChange={this.handleTimeChangeSecond}
                    verticalLineClassNamesForTime={(timeStart, timeEnd) => {
                        return []
                    }}
                    itemRenderer={this.itemRenderer} >
                    <TimelineHeaders>
                        <SidebarHeader>
                            {({ getRootProps }) => {
                                return <div {...getRootProps()} style={{ backgroundColor: '#1E2123', width: 150, padding: 20, borderBottom:'1px solid #BBBBBB' }}>Event Log</div>
                            }}
                        </SidebarHeader>
                        <DateHeader unit="primaryHeader" style={{ backgroundColor: '#1E2123' }} />
                        <DateHeader />
                    </TimelineHeaders>
                </Timeline>
            </div>)
    }

    componentDidMount() {
    }
}

export default CalendarTimeline