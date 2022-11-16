const cuid = require("cuid");
const tokens = new Map()

export function addToken() {
    const uid = cuid()
    tokens.set(uid, {
        uid: null
    })
    return uid
}

// token: string
// returns number
export function isValidToken(token) {
    const d = tokens.get(token)
    return d.uid
}

export function createUser(username, password, dbo) {

}