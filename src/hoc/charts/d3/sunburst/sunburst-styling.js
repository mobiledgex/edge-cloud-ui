import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    action: {
        position: 'absolute',
        left: '50%',
        top: '57%',
        transform: 'translate(-50%, -30%)'
    },
    tooltipBtn: {
        textTransform: 'none',
        color: 'white',
        visibility: props => props.btnVisibility ? 'visible' : 'hidden',
        '&:hover': {
            backgroundColor: "#6E6F73"
        }
    }
});