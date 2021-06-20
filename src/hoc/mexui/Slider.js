import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '95%',
    },
    margin: {
        height: theme.spacing(3),
    },
}));

const CustomSlider = withStyles({
    valueLabel: {
        left:-40,
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#FFF',
            width:100
        },
    },
   
})(Slider);

export default function MSlider(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CustomSlider aria-label="mslider"
                {...props}
                defaultValue={props.min}
                marks
                valueLabelDisplay="on" />
        </div>
    );
}