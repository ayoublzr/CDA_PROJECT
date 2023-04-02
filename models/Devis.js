module.exports=(sequelize,Datatype)=>{
    const Devis=sequelize.define("Devis",{
          firstname:{
            type:Datatype.STRING,
            allowNull:false
          },
          lastname:{
            type:Datatype.STRING,
            allowNull:false
          },
          phone:{
            type:Datatype.INTEGER,
            allowNull:false
          },
          description:{
            type:Datatype.STRING,
            allowNull:false
          }
    }) 
    return Devis
}