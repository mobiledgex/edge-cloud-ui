
/*
*desc: checks if domain is local, only for environment type development
*/
export const isLocal = () => {
    const localDomains = ['localhost', 'kubernetes.docker.internal', '192.168.0.100']
    return localDomains.includes(window.location.hostname)
}

/*
*desc: if host local then use REACT_APP_API_ENDPOINT value from .env
*/
export const hostURL = () => {
    let host = window.location.origin
    if (isLocal()) {
        host = process.env.REACT_APP_API_ENDPOINT
    }
    return host
}

/*
*desc: change default hostname with user defined value
*/
export const changeHostName = (changeWith, value) => {
    let hostName = window.location.hostname
    let host = window.location.origin
    if (hostName.startsWith(changeWith)) {
        return host.replace(changeWith, value)
    }
}

/*
*desc: url without port no
*/
export const urlWithoutPort = () => {
    return `${window.location.protocol}//${window.location.hostname}`
}
