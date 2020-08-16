import React from 'react'
import { useDrop } from 'react-dnd'
import { Chip } from '@material-ui/core'
const style = {
    height: '4rem',
    width: '100%',
    color: 'white',
    padding: '0.9rem',
    textAlign: 'center',
    fontSize: '1rem',
    float: 'left',
}
function selectBackgroundColor(isActive, canDrop) {
    if (isActive) {
        return 'darkgreen'
    } else if (canDrop) {
        return 'darkkhaki'
    } else {
        return '#222'
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
                isActive ? 'Release to drop' :
                    dropList.length <= 0 ? 'Drag headers here to group by' :
                        <div>
                            <h4 style={{ display: 'inline-block', marginRight: 10 }}>Grouped By:</h4>
                            <div style={{ display: 'inline-block', marginRight: 10 }}>{dropList.map((item, i) => {
                                return <Chip label={item} key={i} onDelete={()=>{onRemove(item)}}/>
                            })}</div>
                        </div>
            }
        </div>
    )
}
