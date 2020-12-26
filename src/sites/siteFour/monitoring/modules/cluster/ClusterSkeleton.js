import React from 'react'
import { Card, GridList, GridListTile } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'


class AppSkeleton extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        const { filter } = this.props
        return (
            filter.parent.id === 'cluster' ?
                <div className='grid-charts'>
                    <GridList cols={4} cellHeight={300}>
                        <GridListTile cols={4}>
                            <Skeleton variant='rect' height={300} />
                        </GridListTile>
                    </GridList>
                    <div style={{ margin: 5 }}></div>
                    <Skeleton variant="rect" style={{ height: '56vh', width: '100%' }} />
                </div> : null
        )
    }
}
export default AppSkeleton