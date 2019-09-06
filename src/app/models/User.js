import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (!user.password) return;

      user.password_hash = await bcrypt.hash(user.password, 8);
    });
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Subscription);
  }
}

export default User;