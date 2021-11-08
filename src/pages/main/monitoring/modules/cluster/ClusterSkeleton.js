import React from 'react'
import { ImageList, ImageListItem } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { PARENT_CLUSTER_INST } from '../../../../../helper/constant/perpetual'


class AppSkeleton extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        const { filter } = this.props
        return (
            filter.parent.id === PARENT_CLUSTER_INST ?
                <React.Fragment>
                    <ImageList cols={4} rowHeight={300} style={{ overflow: 'hidden' }}>
                        <ImageListItem cols={4}>
                            <Skeleton variant='rect' height={300} />
                        </ImageListItem>
                    </ImageList>
                    <div style={{ margin: 3 }}></div>
                    <Skeleton variant="rect" style={{ height: '56vh', width: '100%' }} />
                </React.Fragment> : null
        )
    }
}
export default AppSkeleton