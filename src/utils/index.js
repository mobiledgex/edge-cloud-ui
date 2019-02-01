
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
