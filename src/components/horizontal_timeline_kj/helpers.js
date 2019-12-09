/**
 * This file contains some helper functions which are stateless (provide a pure interface)
 * and are used by the timeline component.
 */


/**
 * Differance between two dates
 *
 * @param  {Date} first Date of the first event
 * @param  {Date} second Date of the second event
 * @return {number} Differance between the two dates
 */
export const daydiff = (first, second) => Math.round((second - first));


/**
 * Takes a list of lists and zips them together (size should be the same).
 *
 * e.g. zip([['row0col0', 'row0col1', 'row0col2'], ['row1col0', 'row1col1', 'row1col2']]);
 * = [["row0col0","row1col0"], ["row0col1","row1col1"], ["row0col2","row1col2"]]
 * @param {array} rows An array (of size 2) of arrays (of equal size).
 * @return {array} An array (of size of either array in param) of arrays (of size 2)
 */
export const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));


/**
 * Determines the minimum and maximum distance between a list of dates
 * @param {array} dates The array containing all the dates
 * @return {{min: number, max: number}} The minimum and maximum distances
 */
export const dateDistanceExtremes = (dates) => {
    // determine the minimum distance among events
    const datePairs = zip([dates.slice(0, -1), dates.slice(1)]);
    const dateDistances = datePairs.map(([x, y]) => daydiff(x, y));

    // return the minimum distance between two dates but considering that all dates
    // are the same then return the provided minimum seperation.
    return {
        min: Math.min.apply(null, dateDistances),
        max: Math.max.apply(null, dateDistances)
    };
};


/**
 * @desc : timeline의 간격을 계산처리하는 부분..
 * @param dates
 * @param labelWidth
 * @param minEventPadding
 * @param maxEventPadding
 * @param startPadding
 * @returns {any[]}
 */
export const cummulativeSeperation = (dates, labelWidth, minEventPadding, maxEventPadding, startPadding) => {
    const distances = new Array(dates.length);
    distances[0] = startPadding;
    for (let index = 1; index < distances.length; index += 1) {

        distances[index] = (index + 1) * labelWidth;
    }
    return distances;
};

export const return100 = (count: number) => {


    return 100;


}
