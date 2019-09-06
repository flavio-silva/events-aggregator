import * as yup from 'yup';
import service from '../services/MeetupService';
import ModelNotFoundException from '../services/exceptions/ModelNotFoundException';
import UnauthorizedUserException from '../services/exceptions/UnauthorizedUserException';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    let { date } = req.query;

    date = date ? new Date(date) : new Date();

    const meetups = await service.findByDate(date, page);

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      title: yup
        .string()
        .required()
        .max(255),
      description: yup
        .string()
        .required()
        .max(255),
      place: yup
        .string()
        .required()
        .max(255),
      datetime: yup.date().required(),
      banner_id: yup
        .number()
        .required()
        .integer(),
    });

    try {
      const data = schema.validateSync(req.body);
      const meetup = await service.create({
        ...data,
        ...{ user_id: req.userId },
      });

      return res.json(meetup);
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }

  async edit(req, res) {
    const schema = yup.object().shape({
      title: yup.string().max(255),
      description: yup.string().max(255),
      place: yup.string().max(255),
      datetime: yup.date(),
      banner_id: yup
        .number()
        .integer()
        .min(0),
    });

    try {
      const data = schema.validateSync(req.body);
      const meetup = await service.update(req.params.id, {
        ...data,
        ...{ user_id: req.userId },
      });

      return res.json(meetup);
    } catch (err) {
      if (err instanceof ModelNotFoundException) {
        return res.status(404).json({
          error: err,
        });
      }

      return res.status(400).json({
        error: err.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      await service.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof ModelNotFoundException) {
        return res.status(404).json({
          error: err.message,
        });
      }

      if (err instanceof UnauthorizedUserException) {
        return res.status(401).json({
          error: err.message,
        });
      }

      return res.status(400).json({
        error: err.message,
      });
    }
  }
}

export default new MeetupController();
