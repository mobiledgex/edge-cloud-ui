
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
    layout: {
      backgroundColor: 'black',
      lineHeight: 50,
      textAlign: "center"
    },
    container: {
      lineHeight: 1.5,
      display: 'inline-block',
      verticalAlign: "middle"
    },
    optionBody: {
      backgroundColor: 'black',
      borderColor: 'white',
      padding: 20,
      width: 350
    },
    label: {
      color:'white',
      fontSize: 12,
      height: 30
    },
    cmdLine: {
      color:'white',
      borderRight: 'none',
      borderLeft: 'none',
      borderTop: 'none',
      width: 200,
      backgroundColor: 'black',
      height: 30
    },
    containerId: {
      borderColor: 'white',
      backgroundColor: 'black',
      width: 200,
      height: 30
    },
  connect:{
    color: 'white',
    border: '1px solid',
    padding: 10,
    fontSize: 12,
    marginTop: 20,
    height: 30,
    lineHeight: 0.5,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderColor: 'white',
    height: 30
  }
    
  });