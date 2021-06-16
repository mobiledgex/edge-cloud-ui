import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
    value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRulesCount] === 0 ? 'Full Isolation' : value[fields.outboundSecurityRulesCount];
    return value
}