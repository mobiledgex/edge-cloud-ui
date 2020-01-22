
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
        fontFamily: 'Inconsolata, monospace',
        color: 'white',
        fontSize: 16,
        width:'100%',
        whiteSpace: 'pre-wrap'
    },
    cmdHead: {
        display: 'table',
        width: '100%'
    },
    cmdPath: {
        fontFamily: 'Inconsolata, monospace',
        marginLeft: 0,
        fontSize: 16,
        color: 'white'
    },
    cmdInput: {
        fontFamily: 'Inconsolata, monospace',
        marginLeft: 10,
        fontSize: 16,
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'white'
    },
    actions:{
        backgroundColor: 'black'
    },
    close:{
        color:'white',
    }
})