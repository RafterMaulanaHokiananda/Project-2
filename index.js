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

app.put('/user/:id',  (request, result) => {
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

app.delete('/user/:id',  (request, result) => {
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

app.put('/persediaan/:id',  (request, result) => {
    let data = request.body
    let sql =`
        update persediaan
        set nama = '`+data.nama+`', jenis = '`+data.jenis+`', harga = '`+data.harga+`, stok = '`+data.stok+`'
        where id_barang = `+request.params.id+`
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
app.post('/pembelian/:id', (req, res) => {
    let data = req.body

    conn.query(`
        insert into pesan (id_user, id_barang, jumlah)
        values ('`+data.id_user+`', '`+req.params.id+`','`+data.jumlah+`')
    `, (err, res) => {
        if (err) throw err
    })

    conn.query(`
        update lapangan
        set status = stok - jumlah
        where id_beli = '`+req.params.id+`'
    `, (err, result) => {
        if (err) throw err
    })

    res.json({
        message: "Book has been taked by user"
    })
})



//Transaksi

app.listen(5000, () => {
    console.log('Sippp')
})
