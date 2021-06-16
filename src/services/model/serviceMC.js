import { fetchPath, fetchURL } from '../config';

let sockets = [];

export const sendWSRequest = (request, callback) => {
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