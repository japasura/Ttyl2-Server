const cuid = require("cuid");
const {sha512} = require("js-sha512");
const tokens = new Map()

function addToken() {
    const uid = cuid()
    tokens.set(uid, {
        userId: null
    })
    return uid
}

// token: string
// returns number
function isValidToken(token) {
    const d = tokens.get(token)
    if (!d){
        return null
    }
    return d.userId
}

async function _createUser(username, password, dbo) {
    const userId = cuid()
    const existingUser = await dbo.collection("Users").findOne({
        userName: username
    })
    if (existingUser){
        return false
    } else {
        const salt = cuid()
        dbo.collection("Users").insertOne({
            userId: userId,
            userName: username,
            password: sha512(password + salt),
            salt: salt
        })
        return true
    }
}

async function createUser(req, res, dbo) {

    const token = req.header("Api-Key")
    if (!tokens.has(token)){
        res.status(401).send({error: "INVKEY"})
    }
    if (tokens.get(token).userId){
        res.status(400).send({error: "ALREADY_SIGNED_IN"})
    }

    const form = req.body

    if (form.username && form.password){
        const success = await _createUser(form.username, form.password, dbo)
        res.send({"status": success})
    } else {
        res.status(400).send({error: "Invalid Input"})
    }
}

async function login(req, res, dbo){
    const token = req.header("Api-Key")
    if (tokens.has(token)){
        const body = req.body
        if (body.username && body.password){
            const dbd = await dbo.collection("Users").findOne({userName: body.username})
            if (!dbd){
                dbo.status(403).send({"error": "INVPW"})
            }
            const hashed = sha512(body.password + dbd.salt)
            if (hashed === dbd.password){
                tokens.set(token, {...tokens.get(token), userId: dbd.userId})
                res.send({success: true})
            } else {
                res.status(403).send({"error": "INVPW"})
            }
        } else {
            res.status(400).send({"error": "INVBODY"})
        }
    } else {
        res.status(401).send({"error": "INVKEY"})
    }
}

function useAuth(req, res) {
    const token = req.header("Api-Key")
    const userId = isValidToken(token)
    if (!userId){
        res.status(401).send({error: "INVKEY"})
        return false
    }
    return userId
}

module.exports = {
    addToken,
    createUser,
    login,
    useAuth
}