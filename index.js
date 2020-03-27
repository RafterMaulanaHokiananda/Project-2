const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')


//membuat aplikasi framework express
const app = express()

//inisialisasi secret key yang digunakan oleh JWT
const secretKey = 'thisisverysecretkey'

//enable body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//koneksi -> database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'persediaan'
})

conn.connect((err) => {
    if(err) throw err
    console.log('Connected............')
})


const isAuthorized = (req, res, next) => {
    if(typeof(req.headers['x-api-key']) == 'undefined')
    {
        return res.status(403).json({
            success: false,
            message: 'Unathorized Token is not provided'
        })
    }


//get token dari headers
let token = req.headers['x-api-key']

//melakukuan verivikasi token yang dikirim user
jwt.verify(token, secretKey, (err, decoded) => {
    if(err)
    {
        return res.status(403).json({
            success: false,
            message: 'Unathorized Token'
        })
    }
})

//lanjut ke next request
next()
}


//Login

app.post('/login', (req, res) => {
    let data = req.body

    if(data.username == 'admin' && data.password == 'admin')
    {
        let token = jwt.sign(data.username + ' | ' + data.password, secretKey)

        res.json({
            success: true,
            message: 'Sukses Login',
            token: token
        })
    }
    res.json({
        success: false,
        message: 'dohhh'
    })
})

//User
app.post('/user',isAuthorized,  (req, res) => {
    let data = req.body
    let sql = `
        insert into user(username, password)
        values('`+data.username+`','`+data.password+`');
    `

    conn.query(sql, (err, result) => {
        if(err) throw err
    })
    res.json({
        success: true,
        message: 'Sippp'
    })
})

app.put('/user/:id',isAuthorized,  (request, result) => {
    let data = request.body
    let sql =`
        update user
        set username = '`+data.username+`', password = '`+data.password+`'
        where id_user = `+request.params.id+`
    `

    conn.query(sql, (err, result) => {
        if(err) throw err
    })
    result.json({
        success: true,
        message: 'Sipppp'
    })
})

app.delete('/user/:id',isAuthorized,  (request, result) => {
    let sql =`
        delete from persediaan where id_user = `+request.params.id+`
    `

    conn.query(sql, (err, res) => {
        if(err) throw err
    })
    result.json({
        success: true,
        message: 'Data deleted'
    })
})

//Persediaan
app.get('/persediaan',isAuthorized, (req, res) => {
    let sql = 'select * from persediaan'
    conn.query(sql, (err, result) => {
        if(err) throw err
        res.json({
            success: true,
            message: 'Data',
            data: result
        })
    })
})

app.get('/persediaan/:id',isAuthorized, (req, res) => {
    let sql = `
        select * from persediaan
        where id_barang = `+req.params.id+`
        limit 1
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Data",
            data: result[0]
        })
    })
})

app.post('/persediaan',isAuthorized,  (req, res) => {
    let data = req.body
    let sql = `
        insert into persediaan(nama, jenis, harga, stok)
        values('`+data.nama+`','`+data.jenis+`','`+data.harga+`','`+data.stok+`');
    `

    conn.query(sql, (err, result) => {
        if(err) throw err
    })
    res.json({
        success: true,
        message: 'Sippp'
    })
})

app.put('/persediaan/:id',isAuthorized, (req, res) => {
    let data = req.body

    let sql = `
        update persediaan
        set nama = '`+data.nama+`', jenis = '`+data.jenis+`', harga = '`+data.harga+`', stok = '`+data.stok+`'
        where id_barang = '`+req.params.id+`'
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data has been updated",
            data: result[0]
        })
    })
})

app.delete('/persediaan/:id',isAuthorized,  (request, result) => {
    let sql =`
        delete from persediaan where id_barang = `+request.params.id+`
    `

    conn.query(sql, (err, res) => {
        if(err) throw err
    })
    result.json({
        success: true,
        message: 'Data deleted'
    })
})

//Transaksi
app.post('/pembelian/:id',isAuthorized, (req, res) => {
    let data = req.body

    conn.query(`
        insert into pembelian (id_user, id_barang, jumlah,id_bayar)
        values ('`+data.id_user+`', '`+req.params.id+`','`+data.jumlah+`','`+data.id_bayar+`')
    `, (err, res) => {
        if (err) throw err
    })

    conn.query(`
        update persediaan
        set stok = stok - '`+data.jumlah+`'
        where id_barang = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Pembelian berhasil"
    })
})

app.put('/pembelian/:id',isAuthorized, (req, res) => {
    let data = req.body

    let sql = `
        update pembelian
        set id_user = '`+data.id_user+`', id_barang = '`+data.id_barang+`', jumlah = '`+data.jumlah+`', id_bayar = '`+data.id_bayar+`'
        where id_beli = '`+req.params.id+`'
    `

    conn.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "data has been updated",
            data: result
        })
    })
})

app.delete('/pembelian/:id',isAuthorized, (req, res) => {
    let sql = `
        delete from pembelian
        where id_beli = '`+req.params.id+`'
    `

    conn.query(sql, (err, result) => {
        if (err) throw err
        
        res.json({
            message: "data has been deleted",
            data: result
        })
    })
})

//Transaksi

app.listen(5000, () => {
    console.log('Sippp')
})
