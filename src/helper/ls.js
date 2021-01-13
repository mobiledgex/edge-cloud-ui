
export const LS_USER_META_DATA = 'usermetadata'

export const preferences = () => {
    let preferences = {}
    let data = localStorage.getItem(LS_USER_META_DATA)
    if (data) {
        preferences = JSON.parse(data)
    }
    return preferences
}