module.exports = (sequelize, Datatype) => {
  const DevisDetails = sequelize.define("DevisDetails", {
    id: {
      type: Datatype.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    surface: {
      type: Datatype.INTEGER,
      allowNull: false,
    },
    detail: {
      type: Datatype.STRING,
      allowNull: true,
    },
  });
  DevisDetails.associate = (models) => {
    DevisDetails.belongsTo(models.Devis);
  };
  return DevisDetails;
};
