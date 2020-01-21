
import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles({
    terminalBody: {
        overflow: 'scroll',
        marginTop: 10,
        backgroundColor: 'black',
        width: '100%',
        height: '100%'
    },
    history: {
        color: 'white'
        
    },
    cmdHead: {
        display: 'table',
        width: '100%'
    },
    cmdPath: {
        marginLeft: 0,
        fontSize: 16,
        color: 'white'
    },
    cmdInput: {
        marginLeft: 10,
        fontSize: 16,
        outline: 'none',
        border: 'none',
        backgroundColor: 'black',
        color: 'white'
    },
    actions:{
        backgroundColor: 'black'
    },
    close:{
        color:'white',
    }
})