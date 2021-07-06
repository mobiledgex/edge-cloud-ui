import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { PARENT_APP_INST } from '../../helper/Constant'


class AppSkeleton extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        const { filter } = this.props
        return (
            filter.parent.id === PARENT_APP_INST ?
                <React.Fragment>
                    <GridList cols={4} cellHeight={300}>
                        <GridListTile cols={1}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                        <GridListTile cols={2}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                        <GridListTile cols={1}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                    </GridList>
                    <div style={{ margin: 5 }}></div>
                    <Skeleton variant="rect" style={{ height: '56vh', width: '100%' }} />
                </React.Fragment> : null
        )
    }
}
export default AppSkeleton