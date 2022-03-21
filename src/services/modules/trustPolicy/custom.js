import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.outboundSecurityRulesCount] = value[localFields.outboundSecurityRules].length;
    value[localFields.fullIsolation] = value[localFields.outboundSecurityRulesCount] <= 0
    value[localFields.outboundSecurityRulesCount] = value[localFields.outboundSecurityRulesCount] === 0 ? 'Full Isolation' : value[localFields.outboundSecurityRulesCount];
    return value
}