/* eslint-disable */
const processData = (data) => {
    let isAdmin = false
    let role = undefined
    let dataList = data.data
    for (var i = 0; i < dataList.length; i++) {
        role = dataList[i].role
        if (role.indexOf('Admin') > -1) {
            isAdmin = true
            break;
        }
    }
    self.postMessage({isAdmin, role})
}

export const format = (worker) => {
    processData(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});