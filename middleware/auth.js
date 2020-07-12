module.exports = (app,option) => {
    const AdminUser = require('../models/AdminUser')
    const jwt = require('jsonwebtoken')
    const assert = require("http-assert")
    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请先登录')
        const { id } = jwt.verify(token, app.get('secret'))
        assert(token, 401, '请先登录')
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登录')
        await next()
    }
}