import axios from 'axios-jsonp-pro';

export function getOperator(resource, callback) {
    fetch('http://localhost:3030')
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
export function getOperatorsInfo() {
    axios.post('https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet', {
        firstName: 'Fred',
        lastName: 'Flintstone'
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
