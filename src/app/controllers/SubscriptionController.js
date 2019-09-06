import service from '../services/SubscriptionService';
import UnauthorizedUserException from '../services/exceptions/UnauthorizedUserException';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await service.findAll(req.userId);
    return res.json(subscriptions);
  }

  async store(req, res) {
    try {
      await service.create({
        userId: req.userId,
        meetupId: req.body.meetup_id,
      });
    } catch (err) {
      if (err instanceof UnauthorizedUserException) {
        return res.status(401).json({
          error: err.message,
        });
      }

      return res.status(400).json({
        error: err.message,
      });
    }

    return res.status(201).json({
      message: 'User was registered successfully',
    });
  }
}

export default new SubscriptionController();
