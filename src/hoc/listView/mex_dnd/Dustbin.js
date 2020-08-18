import React from 'react'
import { useDrop } from 'react-dnd'
import { Chip } from '@material-ui/core'
const style = {
    height: 35,
    marginRight:30,
    marginLeft:10,
    padding: '0.3rem',
    border:'1px solid grey',
    width: 250,
    borderRadius:5,
    color: 'white',
    textAlign: 'center',
    fontSize: '1rem',
    float: 'left',
}
function selectBackgroundColor(isActive, canDrop) {
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
                isActive ? 'Release to drop' :
                    dropList.length <= 0 ? 'Drag header here to group by' :
                        <div>
                            <h4 style={{ display: 'inline-block', marginRight: 10 }}><strong style={{fontSize:13}}>Grouped by:</strong></h4>
                            <div style={{ display: 'inline-block', marginRight: 10 }}>{dropList.map((item, i) => {
                                return <Chip size={'small'} label={item.label} key={i} onDelete={()=>{onRemove(item.label)}}/>
                            })}</div>
                        </div>
            }
        </div>
    )
}
