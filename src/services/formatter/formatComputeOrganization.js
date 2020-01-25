
export const getKey = (data) => {
    const { Organization, Type, Address, Phone } = data
    return ({
        name: Organization,
        type: Type,
        address: Address,
        phone: Phone
    })
}
export const formatData = (result) => {
    let values = [];
    if (result.data && result.data.length > 0) {
        result.data.map((data, i) => {
            let Index = i;
            let Type = data.Type || '-';
            let AdminUsername = data.AdminUsername || '-';
            let Organization = data.Name || '-';
            let Address = data.Address || '-';
            let Phone = data.Phone || '-';
            let newRegistKey = ['Organization', 'Type', 'Phone', 'Address'];

            values.push({ Organization: Organization, Type: Type, Phone: Phone, Address: Address, Edit: newRegistKey })
        })
    }
    return values
}
