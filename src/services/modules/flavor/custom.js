import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.gpu] = value.gpu === 'gpu:1' ? 1 : 0;
    return value
}