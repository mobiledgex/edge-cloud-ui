import { operators, perpetual } from "../helper/constant"

const compareObjects = (newData, oldData, ignoreCase) => {
    if ((typeof newData === perpetual.BOOLEAN) && newData === oldData) {
        return true
    }
    else if ((newData === undefined || newData.length === 0) && (oldData === undefined || oldData.length === 0)) {
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

//Deprecated
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
    updateData.fields = Array.from(new Set(updateFields))
    return updateData
}

const compareObjectsNew = (newData, oldData, ignoreCase) => {
    let newType = typeof newData
    let oldType = typeof oldData
    if (newType === undefined && oldType === undefined) {
        return true
    }
    if (newType !== oldType) {
        return false
    }
    else if (Array.isArray(newData) || newType === 'object' || newType === 'string') {
        let newTemp = newData
        let oldTemp = oldData
        if (ignoreCase) {
            newTemp = ((Array.isArray(newData) || newType === 'object') ? JSON.parse(JSON.stringify(newTemp).toLowerCase()) : newTemp.toLowerCase())
            oldTemp = ((Array.isArray(oldData) || oldType === 'object') ? JSON.parse(JSON.stringify(oldTemp).toLowerCase()) : oldTemp.toLowerCase())
        }
        return operators.equal(newTemp, oldTemp)
    }
    else if (newData !== oldData) {
        return false
    }
    return true
}

export const updateFieldDataNew = (self, forms, data, orgData) => {
    let updateData = {}
    let updateRequired = false
    for (const form of forms) {
        if (form.update) {
            let update = form.update
            if (update.key) {
                updateData[form.field] = data[form.field]
            }
            else if (update.edit) {
                if (!compareObjectsNew(data[form.field], orgData[form.field], Boolean(update.ignoreCase))) {
                    updateData[form.field] = data[form.field]
                    updateRequired = true
                }
            }
        }
    }
    if (!updateRequired) {
        self.props.handleAlertInfo('error', 'Nothing to update')
    }
    else {
        return updateData
    }
}