import React from 'react'
import { useDrop } from 'react-dnd'
import { Chip } from '@material-ui/core'

const style = {
    height: 30,
    padding: '0.15rem',
    border: '1px solid #4CAF50',
    marginRight: 25,
    width: 200,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    fontSize: '0.8rem',
}

const selectBackgroundColor = (isActive, canDrop) => {
    if (isActive || canDrop) {
        return '#4CAF50'
    } else {
        return 'transparent'
    }
}

export const Dustbin = ({ dropList, onRemove }) => {
    const allowedDropEffect = 'any'
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'box',
        drop: () => ({
            name: `${allowedDropEffect} Dustbin`,
            allowedDropEffect,
        }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    const backgroundColor = selectBackgroundColor(isActive, canDrop)
    return (
        <div ref={drop} style={{ ...style, backgroundColor }}>
            {
                isActive ?
                    <h4 style={{ display: 'inline-block', fontSize: 12, paddingTop: 3 }}>Release to drop</h4> :
                    dropList.length <= 0 ?
                        <h4 style={{ display: 'inline-block', fontSize: 12, paddingTop: 3 }}>Drag header here to group by</h4> :
                        <div>
                            <h4 style={{ display: 'inline-block', marginRight: 10 }}><strong style={{ fontSize: 12 }}>Grouped by:</strong></h4>
                            <div style={{ display: 'inline-block', marginRight: 10 }}>{dropList.map((item, i) => {
                                return <Chip size={'small'} label={item.label} key={i} onDelete={() => { onRemove(item.label) }} />
                            })}</div>
                        </div>
            }
        </div>
    )
}