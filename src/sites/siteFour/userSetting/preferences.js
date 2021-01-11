import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemText, MenuItem } from '@material-ui/core'
import React from 'react'
import AppsIcon from '@material-ui/icons/Apps';
import CloseIcon from '@material-ui/icons/Close';
import { LS_USER_META_DATA } from '../../../constant';

class Preferences extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            data:{}
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
        this.props.close()
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { open, data } = this.state
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleOpen}>
                    <AppsIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Preferences" />
                </MenuItem>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="profile" disableEscapeKeyDown={true} disableBackdropClick={true}>
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>Preferences</h3>
                        </div>
                        <div style={{ float: "right", display: 'inline-block', marginTop: -8 }}>
                            <IconButton  onClick={this.handleClose}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <Divider />
                    <DialogContent style={{ width: 600 }}>
                        <Grid container>
                            <Grid xs={4} item>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Data Table"
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid xs={6} item>
                                <List>
                                    {Object.keys(data).map((key, i) => (
                                        <ListItem key={i}>
                                            <ListItemText
                                                primary={key}
                                            />
                                        </ListItem>)
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }

    componentDidMount()
    {
        let data= JSON.parse(localStorage.getItem(LS_USER_META_DATA))
        console.log('Rahul1234', data.Map)
        // this.setState({data : JSON.parse(`'${localStorage.getItem(LS_USER_META_DATA)}'`)})
        
    }
}

export default Preferences