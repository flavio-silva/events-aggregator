import service from '../services/MeetupService';

class MyMeetupsController {
  async index(req, res) {
    const meetups = await service.findByUserId(req.userId);
    res.json(meetups);
  }
}

export default new MyMeetupsController();
