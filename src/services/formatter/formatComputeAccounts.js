export const getKey = (data) => {
    let userArr = []
    Object.values(data).map((item) => { userArr.push(item); })
    return ({
        name: userArr[0]
    })
}

/*
{ Name: 'bickhcho1',
       Email: 'whrjsgml111@naver.com',
       EmailVerified: true,
       Passhash: '',
       Salt: '',
       Iter: 0,
       FamilyName: '',
       GivenName: '',
       Picture: '',
       Nickname: '',
       CreatedAt: '2019-05-23T06:29:01.794715Z',
       UpdatedAt: '2019-05-23T06:30:42.082077Z',
       Locked: false }

 */
export const formatData = (result) => {
    let values = [];
    if (result.data && result.data.length > 0) {
        let toJson = result.data;
        if (toJson) {
            toJson.map((dataResult, i) => {
                if (dataResult.message) {
                    values.push({
                        Username: '',
                        Email: '',
                        EmailVerified: '',
                        Passhash: '',
                        Salt: '',
                        Iter: '',
                        FamilyName: '',
                        GivenName: '',
                        Picture: '',
                        Nickname: '',
                        CreatedAt: '',
                        UpdatedAt: '',
                        Locked: '',
                        Edit: null
                    })
                } else {
                    let Index = i;
                    let Username = dataResult.Name || '-';
                    let Email = dataResult.Email || '-';
                    let EmailVerified = dataResult.EmailVerified || '-';
                    let Passhash = dataResult.Passhash || '-';
                    let Salt = dataResult.Salt || '-';
                    let Iter = dataResult.Iter || '-';
                    let FamilyName = dataResult.FamilyName || '-';
                    let GivenName = dataResult.GivenName || '-';
                    let Picture = dataResult.Picture || '-';
                    let Nickname = dataResult.Nickname || '-';
                    let CreatedAt = dataResult.CreatedAt || '-';
                    let UpdatedAt = dataResult.UpdatedAt || '-';
                    let Locked = dataResult.Locked || '-';
                    let newRegistKey = ['Username', 'Email'];

                    values.push({
                        Username: Username,
                        Email: Email,
                        EmailVerified: EmailVerified,
                        Passhash: Passhash,
                        Salt: Salt,
                        Iter: Iter,
                        FamilyName: FamilyName,
                        GivenName: GivenName,
                        Picture: Picture,
                        Nickname: Nickname,
                        CreatedAt: CreatedAt,
                        UpdatedAt: UpdatedAt,
                        Locked: Locked,
                        Edit: newRegistKey
                    })
                }

            })
        }
    }
    return values
}