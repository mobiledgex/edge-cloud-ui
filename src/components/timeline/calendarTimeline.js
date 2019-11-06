import React, { Component } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";
import 'react-calendar-timeline/lib/Timeline.css'
import generateFakeData from "./generate-fake-data";


const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]

const items = [
    {
        id: 1,
        group: 1,
        title: 'item 1',
        start_time: moment(),
        end_time: moment().add(1, 'hour')
    },
    {
        id: 2,
        group: 2,
        title: 'item 2',
        start_time: moment().add(-0.5, 'hour'),
        end_time: moment().add(0.5, 'hour')
    },
    {
        id: 3,
        group: 1,
        title: 'item 3',
        start_time: moment().add(2, 'hour'),
        end_time: moment().add(3, 'hour')
    }
]

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

        const { groups, items } = generateFakeData();
        const defaultTimeStart = moment()
            .startOf("day")
            .toDate();
        const defaultTimeEnd = moment()
            .startOf("day")
            .add(1, "day")
            .toDate();

        // convert every 2 groups out of 3 to nodes, leaving the first as the root
        const newGroups = groups.map(group => {
            const isRoot = (parseInt(group.id) - 1) % 3 === 0;
            const parent = isRoot ? null : Math.floor((parseInt(group.id) - 1) / 3) * 3 + 1;

            return Object.assign({}, group, {
                root: isRoot,
                parent: parent
            });
        });

        this.state = {
            groups: newGroups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            openGroups: {}
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

    render() {
        const { groups, items, defaultTimeStart, defaultTimeEnd, openGroups } = this.state;

        // hide (filter) the groups that are closed, for the rest, patch their "title" and add some callbacks or padding
        const newGroups = groups
            .filter(g => g.root || openGroups[g.parent])
            .map(group => {
                return Object.assign({}, group, {
                    title: group.root ? (
                        <div onClick={() => this.toggleGroup(parseInt(group.id))} style={{ cursor: "pointer" }}>
                            {openGroups[parseInt(group.id)] ? "[-]" : "[+]"} {group.title}
                        </div>
                    ) : (
                        <div style={{ paddingLeft: 20 }}>{group.title}</div>
                    )
                });
            });

        return (
            <Timeline
                groups={newGroups}
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
            />
        );
    }
}
