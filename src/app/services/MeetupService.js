import { isBefore, startOfDay, endOfDay, addHours } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import PastMeetupException from './exceptions/PastMeetupException';
import ModelNotFoundException from './exceptions/ModelNotFoundException';
import UnauthorizedUserException from './exceptions/UnauthorizedUserException';
import User from '../models/User';

class MeetupService {
  findByUserId(userId) {
    const meetups = Meetup.findAll({
      where: { user_id: userId },
      attributes: [
        'id',
        'title',
        'description',
        'place',
        'datetime',
        'user_id',
        'banner_id',
      ],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path'],
        },
      ],
    });

    return meetups;
  }

  create(data) {
    if (isBefore(data.datetime, new Date())) {
      throw new PastMeetupException('Event date must be after current date');
    }

    const meetup = Meetup.create(data);
    return meetup;
  }

  async update(id, data) {
    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      throw new ModelNotFoundException('Meetup not found');
    }

    const { datetime, user_id } = data;

    if (user_id !== meetup.user_id) {
      throw new UnauthorizedUserException(
        "You don't have permission to update this meetup"
      );
    }

    if (datetime && isBefore(datetime, new Date())) {
      throw new PastMeetupException('Event date must be after current date');
    }

    meetup.update(data);
    return meetup;
  }

  async delete(meetupId, userId) {
    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      throw new ModelNotFoundException('Meetup not found');
    }

    const { user_id, datetime } = meetup;

    if (userId !== user_id) {
      throw new UnauthorizedUserException(
        "You don't have permission to delete this meetup"
      );
    }

    if (isBefore(datetime, new Date())) {
      throw new PastMeetupException('Cannot delete past meetup');
    }

    meetup.delete();
  }

  async findByDate(date, page = 1) {
    date = addHours(date, 3);
    const meetups = await Meetup.findAll({
      attributes: ['id', 'title', 'description', 'place', 'datetime'],
      where: {
        datetime: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      limit: 10,
      offset: (page - 1) * page,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return meetups;
  }
}

export default new MeetupService();
