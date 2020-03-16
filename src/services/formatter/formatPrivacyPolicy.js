import { generateUniqueId } from '../serviceMC';

export const layouts = [
  {key:'Region', label:'Region'},
  {key:'OrganizationName', label:'Organization Name'},
  {key:'PrivacyPolicyName', label:'Privacy Policy Name'},
  {key:'OutboundSecurityRules', label:'Outbound Security Rules', 
        layouts : [
          {key:'Protocol', label:'Protocol'},
          {key:'PortRangeMin', label:'Port Range Min'},
          {key:'PortRangeMax', label:'Port Range Max'},
          {key:'RemoteCIDR', label:'Remote CIDR'},
        ]},
]
export const formatData = (datas, body) => {

  let values = [];
  if (datas.data) {
    let toArray = null;
    let toJson = null;
    if (typeof datas.data === 'object') {

    } else {
      toArray = datas.data.split('\n')
      toArray.pop();
    }
    if (toArray) {
      toJson = toArray.map((str) => (JSON.parse(str)))
    } else {
      toJson = [];
      toJson.push((datas.data) ? datas.data : {})
    }

    let newRegistKey = [
      'Region',
      'DeveloperName',
      'PrivacyPolicyName',
      'OutboundSecurityRules',
      'Editable'
    ];
    if (toJson && toJson.length) {
      toJson.map((dataResult, i) => {

        if (dataResult.error || dataResult.message || !dataResult.data) {
          values.push({
            Region: '',
            OrganizationName: '',
            AutoPolicyName: '',
            CloudletCount: '',
            Edit: null,
          })
        } else {
          let Region = body.region || body.params.region || '-';
          let DeveloperName = dataResult.data.key.organization || '-';
          let PrivacyPolicyName = dataResult.data.key.name || '-';
          let OutboundSecurityRules = [];

          if(dataResult.data.outbound_security_rules && dataResult.data.outbound_security_rules.length>0)
          {
            for(let i=0;i<dataResult.data.outbound_security_rules.length;i++)
            {
                let data = dataResult.data.outbound_security_rules[i];
                let Protocol = data.protocol;
                let PortRangeMin = data.port_range_min;
                let PortRangeMax = data.port_range_max;
                let RemoteCIDR=data.remote_cidr;
                OutboundSecurityRules.push({ Protocol: Protocol, PortRangeMin: PortRangeMin, PortRangeMax: PortRangeMax, RemoteCIDR: RemoteCIDR })
            }
          }
          
          let OutboundSecurityRulesCount = OutboundSecurityRules.length;
          values.push({
            uuid: generateUniqueId(),
            Region: Region,
            OrganizationName: DeveloperName,
            PrivacyPolicyName: PrivacyPolicyName,
            OutboundSecurityRulesCount:OutboundSecurityRulesCount,
            OutboundSecurityRules: OutboundSecurityRules,
            Edit: newRegistKey,
          })
        }
      })
    }
  }
  return values

}
