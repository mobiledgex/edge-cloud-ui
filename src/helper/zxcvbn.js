import zxcvbnAsync from 'zxcvbn-async'

export const load = () => {
    return zxcvbnAsync.load({ sync: true });
}