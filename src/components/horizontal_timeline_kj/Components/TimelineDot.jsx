import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import * as moment from 'moment';

/**
 * The static/non-static styles Information for a single event dot on the timeline
 */
const dots = {
    /**
     * The style information for the clickable dates that apper floating over the timeline
     */
    links: {
        position: 'absolute',
        bottom: 0,
        textAlign: 'center',
        paddingBottom: 15,
    },
    /**
     * The base style information for the event dot that appers exactly on the timeline
     */
    base: {
        position: 'absolute',
        bottom: -12,
        height: 30,
        width: 30,
        borderRadius: '50%',
        transition: 'background-color 0.3s, border-color 0.3s',
        ':hover': {}, // We need this to track the hover state of this element
    },
    /**
     * future: The style information for the future dot (wrt selected).
     * @param {object} styles User passed styles ( foreground, background etc info
     */
    future: (styles, status) => ({
        backgroundColor: styles.background,
        // border: `2px solid ${styles.background}`,
        border: `2px solid ${(status.status === 200)? styles.outline2 : styles.outline3}`,
    }),
    /**
     * past: The styles information for the past dot (wrt selected)
     * @param {object} styles User passed styles ( foreground, background etc info
     */
    past: (styles, status) => ({
        backgroundColor: styles.background,
        border: `2px solid ${(status.status === 200)? styles.foreground : styles.errorground}`,
    }),
    /**
     * present: The styles information for the preset dot
     * @param {object} styles User passed styles ( foreground, background etc info
     */
    present: (styles, status) => ({
        backgroundColor: (status.status === 200)? styles.foreground : styles.errorground,
        border: `2px solid ${(status.status === 200)? styles.foreground : styles.errorground}`,
    }),
};


/**
 * The markup for one single dot on the timeline
 *
 * @param {object} props The props passed down
 * @return {StatelessFunctionalReactComponent} The markup for a dot
 */
class TimelineDot extends React.Component {

    __getDotStyles__ = (dotType, key, status) => {
        const hoverStyle = {
            backgroundColor: this.props.styles.foreground,
            border: `2px solid ${this.props.styles.foreground}`,
        };

        return [
            dots.base,
            {left: this.props.labelWidth / 2 - dots.base.width / 2},
            dots[dotType](this.props.styles, status),
            Radium.getState(this.state, key, ':hover') || Radium.getState(this.state, 'dot-dot', 'dot-dot')
                ? hoverStyle
                : undefined,
        ]
    }

    render() {
        let dotType = 'future';
        let selectedTime = JSON.parse(localStorage.getItem("selectedTime"))
        let check = false
        if (this.props.index === JSON.parse(this.props.selected)) {
            dotType = 'present';
        } else if(this.props.index < JSON.parse(this.props.selected)){
            dotType = 'past';
        }

        if(selectedTime){
            selectedTime.map((time, index) => {
                if(new Date(time).getTime() === this.props.date.getTime()){
                    check = true
                }
            })
        }

        return (
            <li
                key={this.props.date}
                id={`timeline-dot-${this.props.date}`}
                className={`${dotType} dot-label`}
                onClick={() => this.props.onClick(this.props.index)}
                style={[
                    dots.links,
                    {
                        left: this.props.distanceFromOrigin - this.props.labelWidth / 2,
                        cursor: 'pointer',
                        width: this.props.labelWidth,
                        ':hover': {}, // We need this to track the hover state of this element
                    }
                ]}
            >
                {this.props.label}
                <span
                    key='dot-dot'
                    style={this.__getDotStyles__(dotType, this.props.date, this.props.status)}
                >
                    {(check)? <div style={{color:"black"}}>V</div>: null}
                </span>
            </li>
        );
    }
}

/**
 * propTypes
 * @type {Object}
 */
TimelineDot.propTypes = {
    // The index of the currently selected dot (required to style as old, present, or future event)
    selected: PropTypes.number.isRequired,
    // The index of the present event (used for deciding the styles alongside selected)
    index: PropTypes.number.isRequired,
    // The actual date of the event (used as key and id)
    date: PropTypes.string.isRequired,
    // The onClick handler ( in this case to trigger the fillingMotion of the timeline )
    onClick: PropTypes.func.isRequired,
    // The date of the event (required to display it)
    label: PropTypes.string.isRequired,
    // The width you want the labels to be
    labelWidth: PropTypes.number.isRequired,
    // The numerical value in pixels of the distance from the origin
    distanceFromOrigin: PropTypes.number.isRequired,
    // The styles prefrences of the user
    styles: PropTypes.object.isRequired
};

export default Radium(TimelineDot);
