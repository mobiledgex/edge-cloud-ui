import React from 'react/lib/React';
import Link from 'react-router-dom/es/Link';
import { Grid, Image, Header, Segment, Table, Rating, Tab } from 'semantic-ui-react';

const panes = [
    { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
    { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
]

const TabMenu = () => (
    <div>
        <Tab panes={panes}></Tab>
    </div>
);
export default TabMenu;