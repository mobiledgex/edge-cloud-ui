import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import { List } from 'semantic-ui-react'

const makeList = (obj) => (
    <List>
        {obj.map((key) => (
            <List.Item>
                <List.Icon name='marker' />
                <List.Content>
                    <List.Header as='a'>{'- '+key}</List.Header>
                </List.Content>
            </List.Item>
            ))
        }
    </List>

)
const Tooltip = ({tooltips, children, hideArrow, ...props}) => (
    <TooltipTrigger
        {...props}
        tooltip={({
                      getTooltipProps,
                      getArrowProps,
                      tooltipRef,
                      arrowRef,
                      placement
                  }) => (
            <div
                {...getTooltipProps({
                    ref: tooltipRef,
                    className: 'tooltip-container'
                })}
            >
                {!hideArrow && <div
                    {...getArrowProps({
                        ref: arrowRef,
                        'data-placement': placement,
                        className: 'tooltip-arrow'
                    })}
                />}
                {makeList(tooltips)}
            </div>
        )}
    >
        {({getTriggerProps, triggerRef}) => (
            <span
                {...getTriggerProps({
                    ref: triggerRef,
                    className: 'trigger'
                })}
            >
        {children}
      </span>
        )}
    </TooltipTrigger>
);

export default Tooltip;
