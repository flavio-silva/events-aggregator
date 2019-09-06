import { Router } from 'express';
import multer from 'multer';
import userController from './app/controllers/UserController';
import sessionController from './app/controllers/SessionController';
import meetupController from './app/controllers/MeetupController';
import BannerUploadController from './app/controllers/BannerUploadController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';
import subscriptionController from './app/controllers/SubscriptionController';
import MyMeetupsController from './app/controllers/MyMeetupsController';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', userController.store);
routes.post('/sessions', sessionController.store);

routes.use(authMiddleware);
routes.put('/users', userController.update);
routes.post('/meetups', meetupController.store);
routes.put('/meetups/:id', meetupController.edit);
routes.get('/meetups', meetupController.index);
routes.get('/my-meetups', MyMeetupsController.index);
routes.delete('/meetups/:id', meetupController.destroy);

routes.get('/subscriptions', subscriptionController.index);
routes.post('/subscriptions', subscriptionController.store);

routes.post('/banner', upload.single('banner'), BannerUploadController.store);
export default routes;
