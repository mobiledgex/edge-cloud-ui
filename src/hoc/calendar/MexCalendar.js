import React from 'react'
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader
} from 'react-calendar-timeline'
import "react-calendar-timeline/lib/Timeline.css";
import { Button, ButtonGroup, Divider, IconButton, Tooltip } from '@material-ui/core'
import '../../../node_modules/react-calendar-timeline/lib/Timeline.css'
import * as dateUtil from '../../utils/date_util'
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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

const calendarDateList = () => ([{ label: 'Month', type: 'year', select: false }, { label: 'Day', type: 'month', select: false }, { label: 'Hour', type: 'day', select: true }, { label: 'Minute', type: 'hour', select: false }])


const endRange = dateUtil.endOfDay().valueOf()
const startRange = dateUtil.startOfDay().valueOf()

class MexCalendar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visibleTimeStart: startRange,
            visibleTimeEnd: endRange,
            calendarDates:calendarDateList(),
            scrolling: true
        }
    }

    handleTimeChangeSecond = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        let length = String(visibleTimeEnd - visibleTimeStart).length
        let type = 'hour'
        if(length > 10)
        {
            type = 'year'
        }
        else if(length > 8)
        {
            type = 'month'
        }
        else if(length > 7)
        {
            type = 'day'
        }
        
        this.setState(prevState=>{
            let calendarDates = prevState.calendarDates
            calendarDates.map(calendar=>{
                calendar.select  = calendar.type === type
            })
            return { visibleTimeStart, visibleTimeEnd, scrolling: true, calendarDates }
        })
    };

    onReset = () => {
        this.setState({ visibleTimeStart: startRange, visibleTimeEnd: endRange, calendarDates:calendarDateList() })
    }

    itemRenderer = ({
        item,
        itemContext,
        getItemProps,
        getResizeProps
    }) => {
        const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
        const backgroundColor = itemContext.selected ? (itemContext.dragging ? "red" : item.selectedBgColor) : item.bgColor;
        return (
            <div {...getItemProps(
                {
                    ...item.itemProps,
                    style: {
                        backgroundColor,
                        color: '#FFF',
                        borderRadius: 4,
                        border: 'none',
                        borderLeftWidth: itemContext.selected ? 3 : 1,
                        borderRightWidth: itemContext.selected ? 3 : 1
                    }
                })}>
                {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

                <div
                    className="rct-item-content"
                    style={{ maxHeight: `${itemContext.dimensions.height}` }}
                >
                    {itemContext.title}
                </div>

                {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
            </div>
        )
    }

    onPrevClick = () => {
        const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
        this.setState(state => ({
            visibleTimeStart: state.visibleTimeStart - zoom,
            visibleTimeEnd: state.visibleTimeEnd - zoom,
            //used to apply animation effect if scroll is programmatic
            scrolling: false
        }));
    };

    onNextClick = () => {
        const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
        this.setState(state => ({
            visibleTimeStart: state.visibleTimeStart + zoom,
            visibleTimeEnd: state.visibleTimeEnd + zoom,
            //used to apply animation effect if scroll is programmatic
            scrolling: false
        }));
    };

    onCustomClick = (index, type)=> {
        let time = this.state.visibleTimeStart
        this.setState(prevState => {
            let calendarDates = prevState.calendarDates
            calendarDates.map((calendarDate, i) => {
                calendarDate.select = index == i
            })
            return {
                visibleTimeStart: dateUtil.startOf(type, time).valueOf(),
                visibleTimeEnd: dateUtil.endOf(type, time).valueOf(),
                //used to apply animation effect if scroll is programmatic
                scrolling: false,
                calendarDates
            }
        });

    }

    

    render() {
        const { dataList, groupList } = this.props
        const {calendarDates} = this.state
        return (
            <div style={{ height: 'calc(100% - 0px)', overflow: 'auto', backgroundColor: '#1E2123', paddingTop: 10 }}>
                <div>
                    <Tooltip title={<strong style={{ fontSize: 13 }}>Previous</strong>}>
                        <IconButton onClick={this.onPrevClick}>
                            <ArrowBackIosIcon fontSize='small' style={{ color: '#76ff03' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<strong style={{ fontSize: 13 }}>Next</strong>}>
                        <IconButton aria-label="refresh" onClick={this.onNextClick}>
                            <ArrowForwardIosIcon fontSize='small' style={{ color: '#76ff03' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<strong style={{ fontSize: 13 }}>Reset</strong>}>
                        <IconButton aria-label="refresh" onClick={this.onReset}>
                            <RefreshIcon fontSize='small' style={{ color: '#76ff03' }} />
                        </IconButton>
                    </Tooltip>
                    {this.props.customRender()}
                    <div style={{ display: 'inline', marginLeft: 20 }}>
                        <ButtonGroup>
                            {calendarDates.map((calendarDate, i) => (
                                <Button key={i} onClick={() => { this.onCustomClick(i, calendarDate.type) }} style={{backgroundColor:`${calendarDate.select ? '#4CAF50' : 'transparent'}`}}>
                                    {calendarDate.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <Divider />
                </div>
                {dataList.length > 0 ? <Timeline
                    scrollRef={el => (this.scrollRef = el)}
                    groups={groupList}
                    items={dataList}
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
                                return <div {...getRootProps()} style={{ backgroundColor: '#1E2123', width: 150, padding: 20, borderBottom: '1px solid #BBBBBB' }}>Usage Log</div>
                            }}
                        </SidebarHeader>
                        <DateHeader unit="primaryHeader" style={{ backgroundColor: '#1E2123' }} />
                        <DateHeader />
                    </TimelineHeaders>
                </Timeline> :
                    <div align="center" style={{ marginTop: '20%' }}>
                        <h3>No Data</h3>
                    </div>
                }
            </div>)
    }
}

export default MexCalendar