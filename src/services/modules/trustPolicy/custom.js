import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
    value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRulesCount] === 0 ? 'Full Isolation' : value[fields.outboundSecurityRulesCount];
    value[fields.outboundSecurityRules] = value[fields.outboundSecurityRules].map((rules) => {
        rules[fields.protocol] = rules[fields.protocol].toLowerCase()
        return rules
    })
    return value
}