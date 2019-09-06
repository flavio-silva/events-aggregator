import Sequelize, { Model } from 'sequelize';
import User from './User';
import Meetup from './Meetup';

class Subscription extends Model {
  static init (sequelize) {
    super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: User,
            as: 'user',
          },
          meetup_id: {
            type: Sequelize.INTEGER,
            references: {
              model: Meetup,
              as: 'meetup',
            },
          },
        },
      },
      { sequelize }
    );
  }

  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
  }
}

export default Subscription;
