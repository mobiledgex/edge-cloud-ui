import isEqual from 'lodash/isEqual'
import max from 'lodash/max'
import min from 'lodash/min'
import mean from 'lodash/mean'

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