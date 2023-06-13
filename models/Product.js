module.exports = (sequelize, Datatype) => {
  const Product = sequelize.define("Product", {
    id: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Datatype.STRING,
      allowNull: false,
    },
    description: {
      type: Datatype.STRING,
      allowNull: false,
    },
    image: {
      type: Datatype.STRING,
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Categorie);
    Product.hasMany(models.DevisDetails);
  };

  return Product;
};
