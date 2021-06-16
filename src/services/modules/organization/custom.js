
import * as perpetual from "../../../helper/constant/perpetual"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    const requestData = request
    let type = requestData ? requestData[fields.type] : undefined
    if (type === undefined || value[fields.type] === type.toLowerCase()) {
        value[fields.publicImages] = value[fields.publicImages] ? perpetual.YES : perpetual.NO
        if (value[fields.type] === perpetual.OPERATOR) {
            value[fields.edgeboxOnly] = value[fields.edgeboxOnly] ? value[fields.edgeboxOnly] : false
        }
        return value
    }
}