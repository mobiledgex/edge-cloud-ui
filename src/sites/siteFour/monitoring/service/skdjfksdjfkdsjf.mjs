let array = ["time", "100ms", "10ms", "25ms", "50ms", "5ms", "app", "apporg", "cellID", "cloudlet", "cloudletorg", "dev", "errs", "foundCloudlet", "foundOperator", "id", "inf", "method", "oper", "reqs", "ver",]


function getIndex(array, searchValue) {

    let __index = 0;
    array.filter((item, index) => {
        if (item === searchValue) {
            __index = index
            return true;
        }
    })

    return __index;
}


let result = getIndex(array, 'foundOperator')


console.log(`sldkfldskflkdsf===>`, result);
