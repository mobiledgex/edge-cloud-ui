
//Grouping objects by a property
export const groupBy = (objectArray, property) => (
    objectArray.reduce((accumulator, obj) => {
        let key = obj[property];
        if(!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(obj);
        return accumulator;
    },{})
)

export const groupByCompare = (objectArray, properties) => (
    objectArray.reduce((accumulator, obj) => {
        let key1 = obj[properties[0]];
        let key2 = obj[properties[1]];
        let key = [properties[0]]+':'+key1 + [properties[1]]+':'+key2
        // console.log('reduce key-', key)
        if(!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(obj);
        return accumulator;
    },{})
)

//Counting instances of values in an object
export const countedNames = (objectArray) => (
    objectArray.reduce((allNames, name) => {
        if (name in allNames) {
            allNames[name]++;
        }
        else {
            allNames[name] = 1;
        }
        return allNames;
    },{})
)


//Remove duplicate items in array
//let orderedArray = Array.from(new Set(myArray));
export const removeDuplicate = (objectArray) => (
    objectArray.reduce((accumulator, currentValue) => {
        if (accumulator.indexOf(currentValue) === -1) {
            accumulator.push(currentValue);
        }
        return accumulator
    }, [])
)

/*
var sum, avg = 0;

// dividing by 0 will return Infinity
// arr must contain at least 1 element to use reduce
if (arr.length)
{
    sum = arr.reduce(function(a, b) { return a + b; });
    avg = sum / arr.length;
}
* */
export const avg = (objectArray) => (
    (objectArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    })) / objectArray.length
)


/*
var arr = [1,2,'xxx','yyy']
arr = arr.filter(function(e){ return e != 'xxx' });
arr  // [1, 2, "yyy"]
 */
export const filterDefine = (objectArray, values) => {
    values.map((filter) => {
        objectArray = objectArray.filter(function (e) {
            return e != filter
        })
    })
    return objectArray;

}
export const filterDeleteKey = (object, prop) => {
    const newObj = Object.keys(object).reduce((obj, key) => {
        if (key !== prop) {
            obj[key] = object[key]
        }
        return obj
    }, {})
    return newObj;
}
export const filterDefineKey = (object, values) => {

    object.map((obj) => {
        values.map((filter) => {
            delete obj[filter]
        })
    })

    return object;

}
export const filterSearch = (data, searchValue) => {
    let searchArr = []
    
    data.filter((item) => {
        if(item.Username.indexOf(searchValue)!==-1){
            searchArr.push(item);
        }
    })
    return searchArr;

}

