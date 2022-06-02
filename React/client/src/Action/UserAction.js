export const EMAIL = 'EMAIL'
export const MAKEUSERKEY = 'MAKEUSERKEY'
export const MAKECHANNELKEY = 'MAKECHANNELKEY'

export function email(useremail) {
    return {
        type: EMAIL, useremail
    };
}

export function makeuserkey(userkey) {
    return {
        type: MAKEUSERKEY, userkey
    };
}

export function makechannelkey(channelkey) {
    return {
        type: MAKECHANNELKEY, channelkey
    };
}