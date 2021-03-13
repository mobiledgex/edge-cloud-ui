import React from 'react'
import { shallow } from 'enzyme'

import { findByTestAttr, checkProps } from '../../../../test/testUtils'
import Monitoring from './Monitoring'

/**
 * Factory function to create a ShallowWrapper for the Monitoring component.
 * @function setup
 * @param {Object} props - Component props sepcific to this setup
 * @returns {ShallowWrapper} 
 */
const setup = (props = {}) => {
    return shallow(<Monitoring/>)
}

test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'component-monitoring');
    expect(component.length).toBe(1);
})