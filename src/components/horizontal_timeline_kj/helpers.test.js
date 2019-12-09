/* eslint no-undef: 0 */
import {daydiff, zip, dateDistanceExtremes, return100} from './helpers';
import {showAuditSelf2} from "../../services/service_audit_api";


test('difference between same date', () => {
    const now = Date.now();
    expect(daydiff(now, now)).toBe(0);
});


test('day difference between two days', () => {
    const first = new Date('01/01/1993');
    const second = new Date('01/02/1993');
    expect(daydiff(first, second)).toBe(86400000);
});

test('the zip', () => {
    const toZip = [['00', '01', '02'], ['10', '11', '12']];
    const result = [['00', '10'], ['01', '11'], ['02', '12']];

    expect(zip(toZip)).toEqual(result);
    // the initial one remains unchanged
    expect(toZip).toEqual(toZip);
});


test('forall arrays x and y and forall i in natural numbers zip([x, y][i] = [x[i], y[i]])', () => {
    for (let j = 0; j < 10; j += 1) {
        const len = Math.round(Math.random() * 100) + 1;
        // given any two arrays x and y
        const x = [...Array(len).keys()].map(_ => Math.random(_));
        const y = [...Array(len).keys()].map(_ => Math.random(_));
        // the zip of those arrays z
        const z = zip([x, y]);

        // has a property that the for all i : z[i] == [x[i], y[i]]
        for (let i = 0; i < len; i += 1) {
            expect(z[i]).toEqual([x[i], y[i]]);
        }
    }
});


test('dateDistanceExtremes', () => {
    const dates = [new Date('2016-01-01'), new Date('2016-01-02'), new Date('2016-01-05')];
    const singleDay = 86400000;
    const result = {
        min: singleDay,
        max: singleDay * 3
    };

    expect(dateDistanceExtremes(dates)).toEqual(result);
});

test('kyungjoongo_genius', () => {


    let results = [1, 2, 3, 4, 4, 5, 6]

    let results2 = 100;

    console.log('itemeLength===>', results);

    console.log('itemeLength===>', '고경준 천재님이십니ㅣ다sdlfksdlkflsdkflk');

    expect(results2 === (return100()))
})

test('showAuditSelf2', async () => {
    let apiPostFix = 'ShowSelf';
    let serviceBody = {
        token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzU3NzUxNDEsImlhdCI6MTU3NTY4ODc0MSwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.dq2cSmVUpYJ1-80inZNh4Q8zvfpmsd4wIDAbL8ZqqNTjyXnMUUXvmeYkKprHRDw1BUKOetMvsrFllNDQoagjzQ",
        params: '{}'
    }

    let result=''
    try{
        result = await showAuditSelf2(apiPostFix, serviceBody)
    }catch (e) {

        console.log('itemeLength===>',  e);
    }


    console.log('itemeLength===>', result);

})

