export const getKey = (data) => {
    let userArr = [];
    Object.values(data).map((item) => { userArr.push(item); })
    return ({
        org: userArr[1],
        username: userArr[0],
        role: userArr[2]
    })
}
/*
{
            "result": {
                "fields": [],
                "key": {
                    "operator_key": {
                        "name": "TDG"
                    },
                    "name": "bonn-niantic"
                },
                "access_uri": "",
                "location": {
                    "latitude": 50.737,
                    "longitude": 7.098,
                    "horizontal_accuracy": 0,
                    "vertical_accuracy": 0,
                    "altitude": 0,
                    "course": 0,
                    "speed": 0,
                    "timestamp": {
                        "seconds": "0",
                        "nanos": 0
                    }
                },
                "ip_support": "IpSupportDynamic",
                "static_ips": "",
                "num_dynamic_ips": 5
            }
        }
//

 */


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