const express=require('express')
const app =express()
const db =require('./models')

app.use(express.urlencoded({ extended:true }))
app.use(express.json())

db.sequelize.sync().then(()=>{
    app.listen(3000,()=>console.log('listening on port 3000'))
})

