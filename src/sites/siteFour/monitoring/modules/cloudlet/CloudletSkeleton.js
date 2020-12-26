import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'


class CloudletSkeleton extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        const { filter } = this.props
        return (
            filter.parent.id === 'cloudlet' ?
                <div className='grid-charts-minimize'>
                    <GridList cols={4} cellHeight={300}>
                        <GridListTile cols={3}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                        <GridListTile cols={1}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                    </GridList>
                    <div style={{ margin: 5 }}></div>
                    <Skeleton variant="rect" style={{ height: '66vh', width: '100%' }} />
                </div> : null
        )
    }
}
export default CloudletSkeleton