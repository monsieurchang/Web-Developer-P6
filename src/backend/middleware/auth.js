let jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1]
        let decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
        let userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}