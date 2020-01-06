
export const getKey = (data) => {
    const { Organization, Type, Address, Phone } = data
    return ({ 
        name: Organization, 
        type: Type, 
        address: Address, 
        phone: Phone 
    })
}
export const formatData = (datas) => {
    let result = datas;
    let values = [];
    if(result.data){
        if(result.data.error){
            console.log("result error")
        }else {
            result.data.map((data, i) => {
                let Index = i;
                let Type = data.Type || '-';
                let AdminUsername = data.AdminUsername || '-';
                let Organization = data.Name || '-';
                let Address = data.Address || '-';
                let Phone = data.Phone || '-';
                let newRegistKey = ['Organization', 'Type', 'Phone', 'Address'];
    
                values.push({Organization:Organization, Type:Type, Phone:Phone, Address:Address, Edit:newRegistKey})
            })
        }
    } else {
        console.log('there is no result')
    }
    return values
}
