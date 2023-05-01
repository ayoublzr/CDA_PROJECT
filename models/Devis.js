module.exports=(sequelize,Datatype)=>{
    const Devis=sequelize.define("Devis",{
          categorie:{
            type:Datatype.STRING,
            allowNull:false
          },
          product:{
            type:Datatype.STRING,
            allowNull:false
          },
          surface:{
            type:Datatype.INTEGER,
            allowNull:false
          },
          description:{
            type:Datatype.STRING,
            allowNull:false
          }
    }) 
    Devis.associate = models => {
      Devis.belongsTo(models.User);
    };
    return Devis
}