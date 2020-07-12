const express = require('express');
const app = express();

app.set('secret', 'denghao')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/', express.static(__dirname + '/web'))
require('./plugin/db')(app)
require('./routers/admin/index')(app)
require('./routers/web/index')(app)


app.listen(3000, () => {
    console.log("服务器启动成功 http://localhost:3000");
})
