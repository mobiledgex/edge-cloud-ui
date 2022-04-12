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

import isEqual from 'lodash/isEqual'
import max from 'lodash/max'
import min from 'lodash/min'
import mean from 'lodash/mean'
import orderBy from 'lodash/orderBy'
import _omit from 'lodash/omit'
import _pick from 'lodash/pick'

export const equal = (item1, item2) => {
    return isEqual(item1, item2)
}

export const _max = (item) => {
    return max(item)
}

export const _min = (item) => {
    return min(item)
}

export const _avg = (item) => {
    return mean(item)
}

export const _sort = (item) => {
    item.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return item
}

export const omit = (item, fields) => {
    return _omit(item, Array.isArray(fields) ? fields : [fields])
}

export const pick = (item, fields) => {
    return _pick(item, Array.isArray(fields) ? fields : [fields])
}

export const _orderBy = (data, fields, order = 'asc') => {
    return orderBy(data, fields, order)
}