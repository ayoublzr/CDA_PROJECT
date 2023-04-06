const express=require('express')
const app =express()
const db =require('./models')
const userRoutes=require('./routers/user-routes')
const productRoutes = require('./routers/product-routes')
const categorieRoutes = require('./routers/categorie-routes')

app.use(express.urlencoded({ extended:true }))
app.use(express.json())
app.use('/',userRoutes)
app.use('/',productRoutes)
app.use('/',categorieRoutes)

db.sequelize.sync().then(()=>{
    app.listen(3000,()=>console.log('listening on port 3000'))
})

