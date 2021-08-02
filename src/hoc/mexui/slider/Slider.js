import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import './style.css'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '95%',
    },
    margin: {
        height: theme.spacing(3),
    },

}));

const CustomSlider = withStyles(() => {
    return ({
        root: {
            color: "#00c853",
            height: 2,
            padding: "15px 0"
        },
        thumb: {
            height: 14,
            width: 14,
            backgroundColor: "#fff",
            marginTop: -6,
            marginLeft: -6
        },
        active: {},
        valueLabel: {
            left: -40,
            top: -22,
            '& *': {
                background: 'transparent',
                color: '#FFF',
                width: 100
            }
        },
        track: {
            height: 2
        },
        mark: {
            backgroundColor: "#00c853",
            height: 5,
            width: 5,
            borderRadius:100,
            marginTop: -2
        },
        markActive: {
            opacity: 1,
            backgroundColor: "currentColor"
        }

    })
})(Slider);


export default function MSlider(props) {
    const classes = useStyles();
    const [size, setSize] = React.useState(window.innerWidth - 150)
    useEffect(() => {
        const ticks = document.getElementsByClassName('MuiSlider-mark')
        props.marks.forEach((mark, i) => {
            ticks[i].style.backgroundColor = mark[`color_${props.markertype}`]
        })
    }, [props.markertype]);

    useEffect(() => {
        window.addEventListener("resize", function () {
            setSize(window.innerWidth - 150)
        })
    }, []);

    return (
        <div className={classes.root} style={{ width: size }}>
            <CustomSlider aria-label="mslider"
                {...props}
                valueLabelDisplay="on" />
        </div>
    );
}