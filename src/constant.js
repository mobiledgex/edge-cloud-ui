export const TYPE_JSON = 'JSON'
export const ADD_CLOUDLET = 'AddCloudlet'
export const DELETE_CLOUDLET = 'DeleteCloudlet'
export const ADD_ORGANIZATION = 'AddOrganization'
export const DELETE_ORGANIZATION = 'DeleteOrganization'
export const DELETE = 'Delete'
export const SELECT = 'Select'

/**
 * Filter Data
 * remove data which are in selectedDatas
*/
export const filterData = (selectedDatas, dataList, field) => {
    if (selectedDatas && selectedDatas.length > 0) {
        for (let i = 0; i < selectedDatas.length; i++) {
            let selectedData = selectedDatas[i];
            for (let j = 0; j < dataList.length; j++) {
                let filterData = dataList[j]
                if (selectedData[field] === filterData[field]) {
                    dataList.splice(j, 1)
                    break;
                }
            }
        }
    }
    return dataList
}