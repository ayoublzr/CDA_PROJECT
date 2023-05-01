module.exports = (sequelize, Datatype) => {
  const Product = sequelize.define("Product", {
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
    video: {
      type: Datatype.BLOB,
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Categorie);
    
  };

  return Product;
};
