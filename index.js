const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')


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
//User
app.post('/user',  (req, res) => {
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


//Persediaan
app.get('/persediaan', (req, res) => {
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

app.get('/persediaan/:id', (req, res) => {
    let sql = `
        select * from persediaan
        where id_sedia = `+req.params.id+`
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

app.post('/persediaan',  (req, res) => {
    let data = req.body
    let sql = `
        insert into data(nama, jenis,  harga, stok)
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

app.put('/persediaan/:id',isAuthorized,  (request, result) => {
    let data = request.body
    let sql =`
        update persediaan
        set nama = '`+data.nama+`', jenis = '`+data.jenis+`', harga = '`+data.harga+`, stok = '`+data.stok+`'
        where id_sedia = `+request.params.id+`
    `

    conn.query(sql, (err, result) => {
        if(err) throw err
    })
    result.json({
        success: true,
        message: 'Sipppp'
    })
})

app.delete('/persediaan/:id',  (request, result) => {
    let sql =`
        delete from persediaan where id_sedia = `+request.params.id+`
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

app.listen(5000, () => {
    console.log('Sippp')
})
