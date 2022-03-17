import { fetchPath, fetchURL, responseValid } from '../config';


let sockets = [];

const sendWSRequest = (request, callback) => {
    const ws = new WebSocket(`${fetchURL(true)}/ws${fetchPath(request)}`)
    ws.onopen = () => {
        sockets.push({ uuid: request.uuid, socket: ws, isClosed: false });
        ws.send(`{"token": "${request.token}"}`);
        ws.send(JSON.stringify(request.data));
    }
    ws.onmessage = evt => {
        let data = JSON.parse(evt.data);
        let response = {};
        response.data = data;
        callback({ request: request, response: response, wsObj: ws });
    }

    ws.onclose = evt => {
        sockets.map((item, i) => {
            if (item.uuid === request.uuid) {
                if (item.isClosed === false && evt.code === 1000) {
                    callback({ request: request, wsObj: ws, close: true })
                }
                sockets.splice(i, 1)
            }
        })
    }
}

/**
 * fetch token for websocket
 * @param {*} request 
 * @param {*} auth 
 * @returns
 */
 export const token = async (self) => {
    let mc = await authSyncRequest(self, { method: WS_TOKEN })
    if (responseValid(mc)) {
        return mc.response.data.token
    }
    else {
        if (self && self.props && self.props.history) {
            self.props.history.push('/logout');
        }
    }
}

/**
 * orgData : this parameter is useful when we are trying to process multiple 
 *           data and need to access original data for which request was made
 *           because websocket supports multi request response 
 *  **/
 export const request = async (self, requestData, callback, orgData) => {
    let token = await fetchWSToken(self)
    if (token) {
        requestData.token = token;
        requestData.orgData = orgData
        sendWSRequest(requestData, callback)
    }
}
