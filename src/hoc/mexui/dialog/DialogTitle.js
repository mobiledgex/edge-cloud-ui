
import { Typography, Box, Divider } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/styles';
import Icon from '../Icon';
import IconButton from '../IconButton';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1.5, 2, 0.3, 2),
    // backgroundColor:'#3B3F47'
  },
  closeButton: {
    marginTop: -9,
    marginRight:-6
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <div>
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Box display='flex'>
        <Box flexGrow={1}>
          <Typography variant="h6" display='inline'>{children}</Typography>
        </Box>
        <Box>
          {onClose ? (
            <IconButton tooltip='close' aria-label="close" className={classes.closeButton} onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          ) : null}
        </Box>
      </Box>
    </MuiDialogTitle>
    <Divider/>
    </div>
  );
});

export default DialogTitle
