import React from 'react'
import { useDrag } from 'react-dnd'
const style = {
    border: 'none',
    backgroundColor: 'transparent'
}
export const Box = ({ headCell, isDropped }) => {
    const item = { label : headCell.label, field : headCell.field, type: 'box' }
    const [{ opacity }, drag] = useDrag({
        item,
        end(item, monitor) {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                let alertMessage = ''
                const isDropAllowed =
                    dropResult.allowedDropEffect === 'any' ||
                    dropResult.allowedDropEffect === dropResult.dropEffect
                if (isDropAllowed) {
                    const isCopyAction = dropResult.dropEffect === 'copy'
                    const actionName = isCopyAction ? 'copied' : 'moved'
                    isDropped(item)
                    alertMessage = `You ${actionName} ${item.label} into ${dropResult.name}!`
                } else {
                    alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`
                }
            }
        },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
        }),
    })
    return (
        <div ref={drag} style={{ ...style, opacity }}>
            {headCell.label}
        </div>
    )
}
