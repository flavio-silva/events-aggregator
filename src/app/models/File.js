import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        originalName: Sequelize.STRING,
        filename: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      { sequelize }
    );
  }
}

export default File;
