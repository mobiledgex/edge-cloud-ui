import React from 'react'
import { shallow } from 'enzyme'

import { findByTestAttr, checkProps } from '../../../../../../test/testUtils'
import MexLineChart from './MexLineChart'

/**
 * Factory function to create a ShallowWrapper for the Monitoring component.
 * @function setup
 * @param {Object} props - Component props sepcific to this setup
 * @returns {ShallowWrapper} 
 */
const setup = (props = {}, state = null) => {
    let wrapper = shallow(<MexLineChart {...props} />)
    if (state) wrapper.setState(state);
    return wrapper
}

test('renders without error', () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'component-line-chart');
    expect(component.length).toBe(1);
})