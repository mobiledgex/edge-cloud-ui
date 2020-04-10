import React from 'react';
import PropTypes from 'prop-types';
// Decorators
import Radium from 'radium';
import dimensions from 'react-dimensions';
// Components
import EventsBar from './EventsBar';
// Helpers and constansts
import {cummulativeSeperation} from '../helpers';
import Constants from '../Constants';

const getLabel = (date, task, index) => {

    return (new Date(date)).toDateString().substring(4);
}


/**
 * customized by kyungjoon.go
 *
 * https://github.com/sherubthakur/react-horizontal-timeline
 *
 */
class HorizontalTimeline extends React.Component {

    render() {
        const props = this.props;

        if (!props.containerWidth) {
            //As long as we do not know the width of our container, do not render anything!
            return false;
        }

        // Convert the date strings to actual date objects
        let dates = props.values.map((value) => new Date(value));
        // console.log('111.dates0===>', dates);
        dates = dates.sort((a, b) => b - a);

        // console.log('111.dates===>', dates);
        // Calculate the distances for all events
        const distances = cummulativeSeperation(
            dates,
            props.labelWidth,
            props.minEventPadding,
            props.maxEventPadding,
            props.linePadding,
        );

        let _dates = props.values;

        let _tasks = props.tasks;

        let _status = props.status;

        _dates = _dates.sort((a, b) => b - a);

        //console.log('111..__dates===>', _dates);

        //console.log('111.distances===>', distances);

        // Convert the distances and dates to events
        const events = distances.map((distance, index) => ({
            distance,
            label: props.getLabel(_dates[index], _tasks[index], index),
            date: dates[index],
            status: _status[index]
        }));

        //console.log('111.events===>', events);

        const visibleWidth = this.props.containerWidth - 80;

        const totalWidth = Math.max(
            events[events.length - 1].distance + this.props.linePadding,
            visibleWidth
        );

        let barPaddingRight = 0;
        let barPaddingLeft = 0;
        if (!this.props.isOpenEnding) {
            barPaddingRight = totalWidth - events[events.length - 1].distance;
        }
        if (!this.props.isOpenBeginning) {
            barPaddingLeft = events[0].distance;
        }

        return (
            <div style={{}}>
                <EventsBar
                    height={props.containerHeight}
                    events={events}
                    isTouchEnabled={props.isTouchEnabled}
                    totalWidth={totalWidth}
                    visibleWidth={visibleWidth}
                    index={props.index}
                    styles={props.styles}
                    indexClick={props.indexClick}
                    labelWidth={props.labelWidth}
                    fillingMotion={props.fillingMotion}
                    barPaddingRight={barPaddingRight}
                    barPaddingLeft={barPaddingLeft}
                />


            </div>
        );
    };

}

/**
 * The expected properties from the parent
 * @type {Object}
 */
HorizontalTimeline.propTypes = {
    // --- EVENTS ---
    // Selected index
    index: PropTypes.number,
    // Array containing the sorted date strings
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.string),
    // Function that takes the index of the array as argument
    indexClick: PropTypes.func,
    // Function to calculate the label based on the date string
    getLabel: PropTypes.func,
    // --- POSITIONING ---
    // the minimum padding between events
    minEventPadding: PropTypes.number,
    // The maximum padding between events
    maxEventPadding: PropTypes.number,
    // Padding at the front and back of the line
    linePadding: PropTypes.number,
    // The width of the label
    labelWidth: PropTypes.number,
    // --- STYLING ---
    styles: PropTypes.object,
    fillingMotion: PropTypes.object,
    slidingMotion: PropTypes.object,
    isOpenEnding: PropTypes.bool,
    isOpenBeginning: PropTypes.bool,
    // --- INTERACTION ---
    isTouchEnabled: PropTypes.bool,
    isKeyboardEnabled: PropTypes.bool,
};

/**
 * The values that the properties will take if they are not provided
 * by the user.
 * @type {Object}
 */
HorizontalTimeline.defaultProps = {
    // --- EVENTS ---
    getLabel: getLabel,
    // --- POSITIONING ---
    minEventPadding: Constants.MIN_EVENT_PADDING,
    maxEventPadding: Constants.MAX_EVENT_PADDING,
    linePadding: Constants.TIMELINE_PADDING,
    labelWidth: Constants.DATE_WIDTH,
    // --- STYLING ---
    styles: {
        outline: '#dfdfdf',
        outline2: '#096d05',
        background: '#f8f8f8',
        foreground: '#096d05'
    },
    fillingMotion: {
        stiffness: 150,
        damping: 25
    },
    slidingMotion: {
        stiffness: 150,
        damping: 25
    },
    isOpenEnding: true,
    isOpenBeginning: true,
    // --- INTERACTION ---
    isTouchEnabled: true,
    isKeyboardEnabled: true,
};

export default Radium(dimensions({elementResize: true})(HorizontalTimeline));
