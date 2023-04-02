
module.exports=(sequelize,Datatype)=>{
  const Categorie=sequelize.define('Categorie',{
      name:{
          type:Datatype.STRING,
          allowNull:false
          
      },
     
      
  })
  Categorie.associate=models=>{
    Categorie.belongsTo(models.Product,{onDelete:"cascade"})
  
      
  }
  return Categorie

}