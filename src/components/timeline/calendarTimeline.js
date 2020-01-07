import React, { Component } from "react";
import moment from "moment";

import Timeline,{TimelineHeaders, SidebarHeader, DateHeader, CustomHeader} from "react-calendar-timeline";
import 'react-calendar-timeline/lib/Timeline.css'
import randomColor from "randomcolor";


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

export default class CalendarTimeline extends Component {
    constructor(props) {
        super(props);

        const { groups, items } = this.generateData();
        const defaultTimeStart = moment()
            .startOf("day")
            .toDate();
        const defaultTimeEnd = moment()
            .startOf("day")
            .add(1, "day")
            .toDate();

        this.state = {
            groups: groups,
            items,
            defaultTimeStart,
            defaultTimeEnd
        };
    }

    handleItemSelect = (itemId, _, time) => {
        console.log('Selected: ' + itemId, moment(time).format())
    }

    generateData = (groupCount = 30, itemCount = 1000, daysInPast = 30) => {
        let randomSeed = Math.floor(Math.random() * 1000)
        let groups = []
        let items = []
        this.props.tasksList.map( (tValue, tIndex) => {
            if(tIndex === 0){
                groups.push({
                    id: (tIndex+1),
                    title: tValue,
                    rightTitle: "bb",
                    bgColor: randomColor({luminosity: 'light', seed: randomSeed + tIndex})
                })

                this.props.timesList.map( (item, index) =>{
                    const startDate = Date.parse(item)
                    const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
                    const endValue = moment(startDate + 10 * 60 * 1000).valueOf()

                    if(index === 0){
                        items.push({
                            id: index + '',
                            group: groups[tIndex].id + '',
                            title: item,
                            start: startDate,
                            end: endValue,
                            onItemSelect: this.handleItemSelect,
                            canMove: startValue > new Date().getTime(),
                            canResize: startValue > new Date().getTime() ? (endValue > new Date().getTime() ? 'both' : 'left') : (endValue > new Date().getTime() ? 'right' : false),
                            className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
                        })
                    }
                })
            } else {
                let a = 0
                for(let i=0; i < (this.props.tasksList.length-1) ; i++){
                    if(groups[i] !== undefined){
                        if(groups[i].title === tValue){
                            a = 1
                            this.props.timesList.map( (item, index) =>{
                                const startDate = Date.parse(item)
                                const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
                                const endValue = moment(startDate + 10 * 60 * 1000).valueOf()
                                if(tIndex === index){
                                    items.push({
                                        id: index + '',
                                        group: groups[i].id + '',
                                        title: item,
                                        start: startDate,
                                        end: endValue,
                                        canMove: startValue > new Date().getTime(),
                                        canResize: startValue > new Date().getTime() ? (endValue > new Date().getTime() ? 'both' : 'left') : (endValue > new Date().getTime() ? 'right' : false),
                                        className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
                                    })
                                }
                            })
                        }
                    }
                }
                if(a !== 1){
                    groups.push({
                        id: (tIndex+1),
                        title: tValue,
                        rightTitle: "bb",
                        bgColor: randomColor({luminosity: 'light', seed: randomSeed + tIndex})
                    })
                }
            }
        })
        console.log("20200106 " + JSON.stringify(items))

        items = items.sort((a, b) => b - a)

        return { groups, items }
    }

    render() {
        const { groups, items, defaultTimeStart, defaultTimeEnd, openGroups } = this.state;

        return (
            <Timeline
                groups={groups}
                items={items}
                keys={keys}
                sidebarWidth={500}
                // canMove
                canResize="right"
                canSelect
                itemsSorted
                itemTouchSendsClick={false}
                stackItems
                itemHeightRatio={0.75}
                showCursorLine
                onItemSelect={this.handleItemSelect}
                defaultTimeStart={defaultTimeStart}
                defaultTimeEnd={defaultTimeEnd}
            >
                <TimelineHeaders className="sticky">
                    <SidebarHeader>
                        {({ getRootProps }) => {
                            return <div {...getRootProps()}></div>;
                        }}
                    </SidebarHeader>
                    <DateHeader unit="primaryHeader" />
                </TimelineHeaders>
            </Timeline>
        );
    }
}
