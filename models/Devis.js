module.exports=(sequelize,Datatype)=>{
    const Devis=sequelize.define("Devis",{
      id: {
        type: Datatype.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      commentaire: {
        type: Datatype.STRING,
        allowNull: true
      }
    }) 
    Devis.associate = models => {
      Devis.belongsTo(models.User);
      Devis.hasMany(models.DevisDetails, { onDelete: 'CASCADE' });
      
      
    };
    return Devis
}