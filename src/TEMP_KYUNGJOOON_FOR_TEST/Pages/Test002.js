import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import VirtualDraggableGrid from 'react-virtual-draggable-grid';

const ItemComponent = props => {
    const {name, styles} = props;

    return (
        <div
            style={{
                userSelect: 'none',
                border: '1px solid black',
                fontFamily: 'sans-serif',
                background: 'navy',
                ...styles,
            }}
        >
            <p
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    width: '100%',
                    height: '60%',
                    fontSize: 18,
                }}
            >
                {`Draggable ${name}!`}
            </p>
        </div>
    );
};

ItemComponent.propTypes = {
    name: PropTypes.string.isRequired,
    styles: PropTypes.object,
};

ItemComponent.defaultProps = {
    styles: {},
};

export default class Test002 extends React.Component {
    constructor(props) {
        super(props);

        const item = {
            fixedWidth: 200,
            fixedHeight: 100,
            ItemComponent,
            itemProps: {
                styles: {
                    width: 'calc(100% - 2px)',
                    height: 'calc(100% - 2px)',
                },
            },
        };

        const x = 2;
        const y = 2;
        const items = [];

        for (let iY = 0; iY < y; iY += 1) {
            const row = [];
            items.push(row);
            for (let iX = 0; iX < x; iX += 1) {
                const newItem = {
                    fixedWidth: iX % 2 === 1 ? 1200 : 400,
                    fixedHeight: 100,
                    ItemComponent,
                    itemProps: {
                        styles: {
                            width: iX % 2 === 1 ? 1200 : 400,
                            height: 'calc(100% - 2px)',
                        },
                    },
                };
                const increment = iX + iY * x;
                const key = `item-${increment}`;

                newItem.key = key;
                newItem.itemProps = {...item.itemProps, name: key};
                newItem.fixedWidth = iX % 2 === 1 ? 1200 : 400
                newItem.fixedHeight = item.fixedHeight + 20 * increment;

                row.push(newItem);
            }
        }

        console.log('items===>', items[1]);


        this.state = {items};
    }

    // optional; RVDG works as a controlled
    // or an uncontrolled component
    getItems = items => {
        this.setState({items});
    };

    render() {
        return (
            <div style={{width: '1200', height: '1200px', margin: 20, backgroundColor: 'blue'}}>
                <VirtualDraggableGrid
                    items={this.state.items}
                    //noDragElements={['button']}
                    //gutterX={10}
                    //gutterY={10}
                    scrollBufferX={300}
                    scrollBufferY={300}
                    getItems={this.getItems}
                    fixedRows={true}
                    fixedWidthAll={1200}
                    fixedHeightAll={600}
                />
            </div>
        );
    }
}
