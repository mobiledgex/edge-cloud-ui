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

        const groups  = this.generateGroupsData();
        const items = this.generateItemsData(groups);
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
            defaultTimeEnd,
            selectedData:''

        };
    }

    toggleGroup = id => {
        const { openGroups } = this.state;
        this.setState({
            openGroups: {
                ...openGroups,
                [id]: !openGroups[id]
            }
        });
    };

    handleItemSelect = (itemId, _, time) => {
        let items = this.state.items
        items.map((item) => {
            if(item.id === itemId){
                this.props.callback(item.start, item.id)
            }
        })
    }

    generateGroupsData = () => {
        let randomSeed = Math.floor(Math.random() * 1000)
        let groups = []
        this.props.tasksList.map( (tValue, tIndex) => {
            let a = 0
            for(let i=0; i < this.props.tasksList.length; i++) {
                if(groups[i] !== undefined) {
                    if(groups[i].title === tValue) {
                        a = 1
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
        })
        return groups
    }

    generateItemsData = (groups) => {
        let items = []
        this.props.tasksList.map( (tValue, tIndex) => {
            for(let i=0; i < (this.props.tasksList.length) ; i++){
                if(groups[i] !== undefined){
                    if(groups[i].title === tValue){
                        this.props.timesList.map( (item, index) =>{
                            const startDate = Date.parse(item)
                            const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
                            const endValue = moment(startDate + 5 * 60 * 1000).valueOf()
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
        })
        items = items.sort((a, b) => b - a)
        this.setState({"items" : items})

        return items
    }

    render() {
        const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

        return (
            <Timeline
                groups={groups}
                items={items}
                keys={keys}
                sidebarWidth={150}
                canMove
                canResize="right"
                canSelect
                itemsSorted
                itemTouchSendsClick={false}
                stackItems
                itemHeightRatio={0.75}
                showCursorLine
                defaultTimeStart={defaultTimeStart}
                defaultTimeEnd={defaultTimeEnd}
                onItemSelect={this.handleItemSelect}
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
