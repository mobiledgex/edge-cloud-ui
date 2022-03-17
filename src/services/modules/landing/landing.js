import { CREATE_USER, LOGIN, RESEND_VERIFY, RESET_PASSWORD_REQUEST, VERIFY_EMAIL } from '../../endpoint/nonauth';
import { responseValid } from '../../config';
import { syncRequest } from '../../service';

export const sendVerify = async (self, data) => {
    let mc = await syncRequest(self, { method: RESEND_VERIFY, data: data })
    return responseValid(mc)
}

export const verifyEmail = async (self, data) => {
    let mc = await syncRequest(self, { method: VERIFY_EMAIL, data: data })
    return mc
}

export const createUser = async (self, data) => {
    let mc = await syncRequest(self, { method: CREATE_USER, data: data })
    return mc
}

export const login = async (self, data) => {
    let mc = await syncRequest(self, { method: LOGIN, data: data })
    return mc
}

export const resetPasswordRequest = async (self, data) => {
    let mc = await syncRequest(self, { method: RESET_PASSWORD_REQUEST, data: data })
    return responseValid(mc)
}

