export const getKey = (data) => {
    let userArr = [];
    Object.values(data).map((item) => { userArr.push(item); })
    return ({
        org: userArr[1],
        username: userArr[0],
        role: userArr[2]
    })
}


export const formatData = (result) => {
    let values = [];
    if (result.data && result.data.length > 0) {
        let toJson = result.data;
        if (toJson) {
            toJson.map((dataResult, i) => {
                if (dataResult.message) {

                } else {
                    let Index = i;
                    let Organization = dataResult.org || '-';
                    let Username = dataResult.username || '-';
                    let RoleType = dataResult.role || '-';
                    //let Email = dataResult.email || '-';
                    let newRegistKey = ['Organization', 'Username', 'Role Type'];

                    values.push({ Username: Username, Organization: Organization, 'Role Type': RoleType, Edit: newRegistKey })
                }

            })
        }
    }
    return values
}