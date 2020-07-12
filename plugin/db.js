module.exports = app => {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/node-vue-moba', {
        useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
    }).then(() => {
        console.log('数据库连接成功');
    })
    mongoose.set('useFindAndModify', false)

    require('require-all')(__dirname + '/../models')
}