
import * as perpetual from "../../../helper/constant/perpetual"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    const requestData = request
    let type = requestData ? requestData[localFields.type] : undefined
    if (type === undefined || value[localFields.type] === type.toLowerCase()) {
        value[localFields.publicImages] = value[localFields.publicImages] ? perpetual.YES : perpetual.NO
        if (value[localFields.type] === perpetual.OPERATOR) {
            value[localFields.edgeboxOnly] = value[localFields.edgeboxOnly] ? value[localFields.edgeboxOnly] : false
        }
        return value
    }
}