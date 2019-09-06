import Sequelize, { Model } from 'sequelize';
import User from './User';
import File from './File';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        place: Sequelize.STRING,
        datetime: Sequelize.DATE,
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        banner_id: {
          type: Sequelize.INTEGER,
          references: {
            model: File,
            key: 'id',
          },
        },
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
    this.hasMany(models.Subscription);
  }
}

export default Meetup;
