
export const fetchPath = (request) => {
    return `/api/v1/${request.method}`;
}

export const fetchHeader = (request) => {
    let headers = {};
    if (request.token) {
        headers = {
            'Authorization': `Bearer ${request.token}`
        }
    }
    if (request.headers) {
        headers = { ...headers, ...request.headers }
    }
    return headers;
}

export const fetchResponseType = (request) => {
    return request.responseType ? request.responseType : undefined

}

export const fetchURL = (isWebSocket) => {
    let serverURL = ''
    if (process.env.NODE_ENV === 'production') {
        var url = window.location.href
        var arr = url.split("/");
        serverURL = arr[0] + "//" + arr[2]

        if (isWebSocket) {
            serverURL = serverURL.replace('http', 'ws')
        }
    }
    else {
        if (isWebSocket) {
            serverURL = process.env.REACT_APP_API_ENDPOINT.replace('http', 'ws')
        }
    }
    return serverURL
}

export const fetchHttpURL = (request) => {
    return fetchURL(false) + fetchPath(request)
}

export const validateExpiry = (self, message) => {
    if (message) {
        message = message.toLowerCase()
        let isExpired = message.indexOf('expired jwt') > -1 || message.indexOf('expired token') > -1 || message.indexOf('token is expired') > -1
        if (isExpired && self) {
            setTimeout(() => {
                if (self && self.props && self.props.history) {
                    self.props.history.push('/logout');
                }
            }, 2000);
        }
        return !isExpired;
    }
}
