import { operators } from "../helper/constant"

const compareObjects = (newData, oldData, ignoreCase) => {
    if ((newData === undefined || newData.length === 0) && (oldData === undefined || oldData.length === 0)) {
        return true
    }
    else if (newData !== undefined && newData.length > 0 && oldData === undefined) {
        return false
    }
    else if (newData === undefined && oldData !== undefined && oldData.length > 0) {
        return false
    }
    else if (ignoreCase) {
        return operators.equal(newData.toLowerCase(), oldData.toLowerCase())
    }
    else {
        return operators.equal(newData, oldData)
    }
}

export const updateFieldData = (self, forms, data, orgData) => {
    let updateData = {}
    let updateFields = []
    for (let i = 0; i < forms.length; i++) {
        let form = forms[i]
        if (form.update) {
            let update = form.update
            if (update.key) {
                updateData[form.field] = data[form.field]
            }
            else if (update.id) {
                let updateId = update.id
                let ignoreCase = update.ignoreCase ? update.ignoreCase : false
                if (!compareObjects(data[form.field], orgData[form.field], ignoreCase)) {
                    updateData[form.field] = data[form.field]
                    updateFields = [...updateFields, ...updateId]
                }
            }
        }
    }
    if (updateFields.length === 0) {
        self.props.handleAlertInfo('error', 'Nothing to update')
    }
    updateData.fields = updateFields
    return updateData
}