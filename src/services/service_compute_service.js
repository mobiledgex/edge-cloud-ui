import axios from 'axios-jsonp-pro';
import FormatComputeDev from './formatter/formatComputeDeveloper';

export function getOperator(resource, callback) {
    fetch('http://localhost:3030')
        .then(response => response.json())
        .then(data => {
            console.log('infux data == ', data)

        });

}

//curl -X POST "https://mexdemo.ctrl.mobiledgex.net:36001/show/cloudlet" -H "accept: application/json" -H "Content-Type: application/json" --cacert mex-ca.crt --key mex-client.key --cert mex-client.crt
export function getDevelopersInfo(resource, callback) {
    axios.get('/dummyData/db_developer.json')
        .then(function (response) {
            console.log('response developer info from compute services-',response);
            callback(FormatComputeDev(response))
        })
        .catch(function (error) {
            console.log(error);
        });
}
