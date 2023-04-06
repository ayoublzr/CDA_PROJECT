module.exports=(sequelize,Datatype)=>{
    const devisProduct = sequelize.define('devisProduct', {
        ID_jonction: {
          type: Datatype.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Quantité: {
          type: Datatype.INTEGER,
          allowNull: false,
        },
      });
    return devisProduct  
}