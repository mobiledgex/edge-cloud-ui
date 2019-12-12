import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const buttonStyles = {
    link: ({outline}) => ({
        position: 'absolute',
        top: '49px',
        bottom: 'auto',
        transform: 'translateY(-50%)',
        height: 34,
        width: 34,
        borderRadius: '50%',
        border: `2px solid ${outline}`,
        overflow: 'hidden',
        textIndent: '100%',
        whiteSpace: 'nowrap',
        transition: 'border-color 0.3s',
    }),
    icon: (styles, active) => ({
        position: 'absolute',
        left: 0,
        top: '50%',
        bottom: 'auto',
        transform: 'translateY(-50%)',
        height: 20,
        width: 29,
        overflow: 'hidden',
        textIndent: '100%',
        whiteSpace: 'nowrap',
        fill: active ? styles.foreground : styles.outline
    }),
    inactive: (styles) => ({
        color: styles.outline,
        cursor: 'not-allowed',
        ':hover': {
            border: `2px solid ${styles.outline}`
        }
    }),
    active: (styles) => ({
        cursor: 'pointer',
        ':hover': {
            border: `2px solid ${styles.foreground}`,
            color: styles.foreground
        }
    })
};


/**
 * Markup for both the buttons (that translate the timeline left or right).
 *
 * @param  {object} props The info provided by the parent
 * @return {StatelessFunctionalReactComponent} The Markup info for both the buttons
 */
const HorizontalTimelineButtons = (props) => {
    const buttonBackEnabled = Math.round(props.position) < 0;
    const buttonForwardEnabled = Math.round(props.position) > Math.round(props.maxPosition);
    const baseStyles = [
        buttonStyles.link(props.styles),
    ];
    return (
        <div>

        </div>
    )
}


// Expected propteries
HorizontalTimelineButtons.propTypes = {
    // The function to update the slide
    updateSlide: PropTypes.func.isRequired,
    // Information about what portion of the timeline is visible between buttons
    position: PropTypes.number.isRequired,
    // The user passed styles (has fields like foreground, background color etc.)
    styles: PropTypes.object,
    // The maximum position that the timeline component can acuire, (on initial load will be null)
    maxPosition: PropTypes.number
};

// Wrapping the buttons with Radium (so we get all the styling goodness)
export default Radium(HorizontalTimelineButtons);
