import { isBefore, startOfHour, endOfHour } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import UnauthorizedUserException from './exceptions/UnauthorizedUserException';
import PastMeetupException from './exceptions/PastMeetupException';
import queue from '../../lib/Queue';
import meetupSubscriptionMail from '../jobs/MeetupSubscriptionMail';

class SubscriptionService {
  async findAll (userId) {
    const now = new Date();

    const meetups = await Meetup.findAll({
      attributes: ['id', 'title', 'description', 'place', 'datetime'],
      include: [
        {
          model: Subscription,
          where: {
            user_id: userId,
          },
        },
      ],
      where: {
        datetime: {
          [Op.gt]: now,
        },
      },
      order: [['datetime', 'asc']],
    });

    return meetups.map(meetup => {
      const { id, title, description, place, datetime } = meetup;
      return {
        id,
        title,
        description,
        place,
        datetime,
      };
    });
  }

  async create ({ userId: user_id, meetupId: meetup_id }) {
    const meetup = await Meetup.findByPk(meetup_id, {
      attributes: ['title', 'datetime', 'user_id'],
    });

    if (user_id === meetup.user_id) {
      throw new UnauthorizedUserException(
        'You cannot be registered is an event to which you are event organizer'
      );
    }

    const { datetime } = meetup;

    if (isBefore(datetime, new Date())) {
      throw new PastMeetupException('Cannot be registered in a past meetup');
    }

    const alreadyRegisteredInAnotherMeetup = await Subscription.findOne({
      where: {
        user_id,
      },
      include: [
        {
          model: Meetup,
          where: {
            datetime: {
              [Op.between]: [startOfHour(datetime), endOfHour(datetime)],
            },
          },
        },
      ],
    });

    if (alreadyRegisteredInAnotherMeetup) {
      throw new UnauthorizedUserException(
        'You is already registered in another meetup at this time'
      );
    }

    const newSubscription = await Subscription.create({
      user_id,
      meetup_id,
    });

    const user = await User.findByPk(user_id);
    const organizer = await meetup.getUser();

    queue.addJob(meetupSubscriptionMail.key, { user, organizer, meetup });

    return newSubscription;
  }
}

export default new SubscriptionService();
