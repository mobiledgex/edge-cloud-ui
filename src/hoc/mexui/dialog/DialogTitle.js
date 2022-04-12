/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
  const { children, classes, onClose, disabled, color, label, ...other } = props;
  return (
    <div>
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Box display='flex'>
          <Box flexGrow={1}>
            <Typography variant="h5" component="h4" display='inline' style={{ color: color ? color : '#CECECE' }}>{label}</Typography>
          </Box>
          <Box>
            {children}
          </Box>
          <Box>
            {onClose ? (
              <IconButton tooltip='Close' aria-label="close" className={classes.closeButton} onClick={onClose} disabled={disabled} style={{ color: color ? color : '#CECECE' }}>
                <Icon>close</Icon>
              </IconButton>
            ) : null}
          </Box>
        </Box>
      </MuiDialogTitle>
      <Divider />
    </div>
  );
});

export default DialogTitle
