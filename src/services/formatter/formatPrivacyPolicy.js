import { generateUniqueId } from '../serviceMC';


// {"data":{"key":{"developer":"org1580940442-3506691","name":"privacypolicy1580940442-3506691"},"outbound_security_rules":[{"protocol":"icmp","remote_cidr":"1.1.1.1/3"},{"protocol":"tcp","port_range_min":1,"port_range_max":65,"remote_cidr":"1.1.1.1/1"},{"protocol":"udp","port_range_min":3,"port_range_max":6,"remote_cidr":"1.1.1.1/2"}]}}
// {"data":{"key":{"developer":"org1580940673-4308748","name":"privacypolicy1580940673-4308748"},"outbound_security_rules":[{"protocol":"icmp","remote_cidr":"1.1.1.1/3"},{"protocol":"tcp","port_range_min":1,"port_range_max":65,"remote_cidr":"1.1.1.1/1"},{"protocol":"udp","port_range_min":3,"port_range_max":6,"remote_cidr":"1.1.1.1/2"}]}}
// {"data":{"key":{"developer":"org1580940930-626354","name":"privacypolicy1580940930-626354"},"outbound_security_rules":[{"protocol":"icmp","remote_cidr":"1.1.1.1/3"},{"protocol":"tcp","port_range_min":1,"port_range_max":65,"remote_cidr":"1.1.1.1/1"},{"protocol":"udp","port_range_min":3,"port_range_max":6,"remote_cidr":"1.1.1.1/2"}]}}
// {"data":{"key":{"developer":"MobiledgeX","name":"Policy3"},"outbound_security_rules":[{"protocol":"tcp","port_range_min":443,"port_range_max":99999999,"remote_cidr":"2.1.1.1/1"}]}}
// {"data":{"key":{"developer":"org1580937948-988787","name":"privacypolicy1580937948-988787"},"outbound_security_rules":[{"protocol":"icmp","remote_cidr":"1.1.1.1/3"},{"protocol":"tcp","port_range_min":1,"port_range_max":65,"remote_cidr":"1.1.1.1/1"},{"protocol":"udp","port_range_min":3,"port_range_max":6,"remote_cidr":"1.1.1.1/2"}]}}
// {"data":{"key":{"developer":"org1580940373-705716","name":"privacypolicy1580940373-705716"},"outbound_security_rules":[{"protocol":"icmp","remote_cidr":"1.1.1.1/3"},{"protocol":"tcp","port_range_min":1,"port_range_max":65,"remote_cidr":"1.1.1.1/1"},{"protocol":"udp","port_range_min":3,"port_range_max":6,"remote_cidr":"1.1.1.1/2"}]}}

export const formatData = (datas, body) => {

  let values = [];
  if (datas.data && datas.data.length > 0) {
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
          let DeveloperName = dataResult.data.key.developer || '-';
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
