module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const AdminUser = require('../../models/AdminUser')
    const jwt = require('jsonwebtoken')
    const assert = require("http-assert")
    const auth = require('../../middleware/auth')
    const resource = require('../../middleware/resource')
    const multer = require('multer');
    const upload = multer({ dest: __dirname + '/../../uploads' })

    router.get('/', async (req, res) => {
        const queryOption = {}
        if (req.Model.modelName === 'Category') {
            queryOption.populate = 'parent'
        }
        const currentPage = parseInt(req.query.currentPage)
        const pageSize = parseInt(req.query.pageSize)
        const query = req.Model.find()
        const count = await query.countDocuments()
        const items = await query.find().setOptions(queryOption).skip((currentPage - 1) * pageSize).limit(pageSize)
        res.send({
            items, count
        })
    })

    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({ mes: '删除成功' })
    })

    app.use('/admin/api/rest/:resource', auth(app), resource(), router)


    app.post('/admin/api/upload', auth(app), upload.single('file'), async (req, res) => {
        const file = req.file
        file.url = `http://www.denghao.shop/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/login', async (req, res) => {
        const { username, password } = req.body

        const model = await AdminUser.findOne({ username }).select('+password')
        assert(model, 422, "用户名不存在")

        const isValid = require('bcrypt').compareSync(password, model.password)
        assert(isValid, 422, "用户名或密码错误")

        const token = jwt.sign({ id: model._id }, app.get('secret'))
        res.send({ msg: '登录成功', token, username })
    })

    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}