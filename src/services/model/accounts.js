import {fields, formatData} from './format'

const keys = [
    { field: fields.username, serverField: 'Name' },
    { field: fields.email, serverField: 'Email' },
    { field: fields.emailVerified, serverField: 'EmailVerified' },
    { field: fields.passHash, serverField: 'Passhash' },
    { field: fields.iter, serverField: 'Iter' },
    { field: fields.familyName, serverField: 'FamilyName' },
    { field: fields.givenName, serverField: 'GivenName' },
    { field: fields.picture, serverField: 'Picture' },
    { field: fields.nickName, serverField: 'Nickname' },
    { field: fields.createdAt, serverField: 'CreatedAt' },
    { field: fields.updatedAt, serverField: 'UpdatedAt' },
    { field: fields.locked, serverField: 'Locked' },
]

export const getKey = (data) => {
    let userArr = []
    Object.values(data).map((item) => { userArr.push(item); })
    return ({
        name: userArr[0]
    })
}

export const getData = (response, body) => {
    return formatData(response, body, keys)
}