import { format, parseISO } from 'date-fns';
import mail from '../../lib/Mail';

class MeetupSubscriptionMail {
  get key() {
    return 'MeetupSubscriptionMail';
  }

  handle({ data }) {
    const { organizer, user, meetup } = data;
    mail.sendMail({
      to: `${organizer.name} <${organizer.email}>`,
      subject: `New subscription on meetup ${meetup.title}`,
      template: 'subscription',
      context: {
        meetup: meetup.title,
        organizer: organizer.name,
        user: user.name,
        date: format(parseISO(meetup.datetime), 'dd/MM/yyyy'),
        time: format(parseISO(meetup.datetime), 'HH:mm'),
      },
    });
  }
}

export default new MeetupSubscriptionMail();
