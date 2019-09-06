import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth,
    });

    this.configTemplateEngine();
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

  configTemplateEngine() {
    const viewPath = resolve(__dirname, '..', 'views', 'emails');

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: exphbs.create({
          extname: '.hbs',
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
}

export default new Mail();
