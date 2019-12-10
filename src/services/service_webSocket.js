import socketIOClient from 'socket.io-client'
//redux
import * as actions from '../actions';
import store from '../store';
import * as utile from '../utils'

const hostname = window.location.hostname;
let _serverUrl = 'https://'+hostname+':3030';

if(process.env.REACT_APP_API_USE_SERVER_SUFFIX === 'true') {
    _serverUrl = 'https://'+hostname+'/server';
}



let stackStates = [];
export function serviceStreaming(stId, callback, body) {

    const socket = socketIOClient(_serverUrl, { secure: true, reconnect: true, rejectUnauthorized : false });
    console.log('20191119 socket connection...',socket, ":", stId)

    // 서버로 자신의 정보를 전송한다.
    socket.emit(stId, {
        name: stId
    });

    // 서버로부터의 메시지가 수신되면
    socket.on(stId, function(data) {
        // stack income message to list array
        if(socket.disconnected){
            console.log('20191119 disconnected socket')
            //stackStates = [];
        }
        //let _data = data['stackData'] ? JSON.parse(data['stackData']) : null;
        console.log('20191119 has data in stacked statues   ', data)

        if(data) {
            if(data.name) console.log('connection stream')
            else if(data.data.message !== 'startSteam' && data.clId) {
                console.log('20191119 message success..', data.clId, ":",data.data.message,":",)
                callback(data, body)
                //store.dispatch(actions.alertInfo('info', data.clId +" : "+data.data.message))
                // refresh
                //store.dispatch(actions.computeRefresh(false))
            }
        }





        /*
        if(_data && _data.length) {
            _data.map((dtd, i) => {
                let keys = Object.keys(JSON.parse(dtd[stId]));
                let parseData = JSON.parse(dtd[stId])
                console.log('20191119 key..', keys, ":",keys[0], ":", parseData,":clId ===>>>>>>>",dtd['clId'])

                let clId = dtd['clId'];
                let _dtd = null
                if(dtd[stId] && keys[0] === 'data') {

                    _dtd = parseData.data ? parseData.data : null;
                    console.log('20191119 login -- ', _dtd,":", stackStates)
                    if(_dtd) {
                        //let message = _dtd.message;
                        //stackStates.push(message)
                        _dtd['clId'] = clId;
                        if(stackStates.length == 0) stackStates.push(_dtd)
                        let sameItem = false;
                        stackStates.map((sItem) => {
                            if(sItem === _dtd) sameItem = true;
                        })
                        if(!sameItem) {
                            stackStates.push(_dtd)
                        }

                        if(_dtd.message.indexOf('successfully') > -1) {
                            store.dispatch(actions.alertInfo('info',_dtd.message))
                            // refresh
                            stackStates = [];
                            store.dispatch(actions.computeRefresh(false))

                        }

                    }

                } else if(dtd[stId] && keys[0] === 'result') {
                    _dtd = parseData.result ? parseData.result.message : null;
                    console.log('20191119 login result -- ', _dtd)
                    if(_dtd) {
                        if(_dtd.indexOf('Failed') > -1 || _dtd.indexOf('failed') > -1) {
                            store.dispatch(actions.alertInfo('error',_dtd))
                        } else {
                            store.dispatch(actions.alertInfo('info',_dtd))
                        }
                        setTimeout(() => socket.disconnect(true), 3000);
                        // refresh
                        stackStates = [];
                        store.dispatch(actions.computeRefresh(false))
                    }
                }
            })
            console.log('20191119 stackStates == ', stackStates)
            store.dispatch(actions.stateStream(stackStates))
        } else {
            // closed streaming
            console.log('20191119 closed streaming....')
        }
        */



    });



    /*
    // Send 버튼이 클릭되면
    $("form").submit(function(e) {
        e.preventDefault();
        var $msgForm = $("#msgForm");
        // 서버로 메시지를 전송한다.
        socket.emit("chat", { msg: $msgForm.val() });
        $msgForm.val("");
    });
     */


    // test.. send msg to pushing server
    setTimeout(() => {
        // 서버로 메시지를 전송한다.
        socket.emit("login", { name: 'Hi. I am client' });
    }, 3000)
}
