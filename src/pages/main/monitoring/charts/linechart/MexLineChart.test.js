/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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