import faker from 'faker'
import randomColor from 'randomcolor'
import moment from 'moment'

export default function (groupCount = 30, itemCount = 1000, daysInPast = 30) {
    let randomSeed = Math.floor(Math.random() * 1000)
    let groups = []
    for (let i = 0; i < groupCount; i++) {
        groups.push({
            id: `${i + 1}`,
            title: faker.name.firstName(),
            rightTitle: faker.name.lastName(),
            bgColor: randomColor({ luminosity: 'light', seed: randomSeed + i })
        })
    }

    let items = []
    for (let i = 0; i < itemCount; i++) {
        const startDate = faker.date.recent(daysInPast).valueOf() + (daysInPast * 0.3) * 86400 * 1000
        const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
        const endValue = moment(startDate + faker.random.number({ min: 2, max: 20 }) * 15 * 60 * 1000).valueOf()

        items.push({
            id: i + '',
            group: faker.random.number({ min: 1, max: groups.length }) + '',
            title: faker.hacker.phrase(),
            start: startValue,
            end: endValue,
            // canMove: startValue > new Date().getTime(),
            // canResize: startValue > new Date().getTime() ? (endValue > new Date().getTime() ? 'both' : 'left') : (endValue > new Date().getTime() ? 'right' : false),
            className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
            itemProps: {
                'data-tip': faker.hacker.phrase()
            }
        })
    }

    // groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
    //
    // items = [
    //     {
    //         id: 1,
    //         group: 1,
    //         title: 'item 1',
    //         start_time: moment(),
    //         end_time: moment().add(1, 'hour')
    //     },
    //     {
    //         id: 2,
    //         group: 2,
    //         title: 'item 2',
    //         start_time: moment().add(-0.5, 'hour'),
    //         end_time: moment().add(0.5, 'hour')
    //     },
    //     {
    //         id: 3,
    //         group: 1,
    //         title: 'item 3',
    //         start_time: moment().add(2, 'hour'),
    //         end_time: moment().add(3, 'hour')
    //     }
    // ]

    items = items.sort((a, b) => b - a)

    return { groups, items }
}
