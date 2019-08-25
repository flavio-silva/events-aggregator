import * as yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required()
        .min(2)
        .max(255),
      email: yup
        .string()
        .required()
        .email()
        .max(255),
      password: yup
        .string()
        .required()
        .min(6)
        .max(20),
    });

    try {
      await schema.validate(req.body);

      const { name, email } = await User.create(req.body);
      return res.status(201).json({
        name,
        email,
      });
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .min(2)
        .max(255),
      email: yup
        .string()
        .email()
        .max(255),
      oldPassword: yup.string(),
      password: yup
        .string()
        .min(6)
        .max(20)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: yup.string().when('password', (password, field) => {
        if (password) {
          return field.required().oneOf([password]);
        }

        return field;
      }),
    });

    try {
      schema.validateSync(req.body);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const user = await User.findByPk(req.userId);

    const { email, oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    if (email && user.email !== email) {
      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    await user.update(req.body);

    return res.status(204).send();
  }
}

export default new UserController();
