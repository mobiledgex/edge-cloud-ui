import axios from "axios";

export const CancelToken = axios.CancelToken;
export const source = CancelToken.source();
setTimeout(() => {
    source.cancel('취소한다 asdasd!!!!==!!!!')
}, 250)



axios({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'get',
    cancelToken: source.token,
    timeout: 30 * 1000
}).then(async response => {
    console.log(`sldkfldskflkdsf===>`, response.data);
}).catch(e => {

    console.log(`sldkfldskflkdsf===>`, e.toString());
    if (axios.isCancel(e)) {
        console.log(e.toString());
    } else {
        //showToast(e.toString())
    }
})




