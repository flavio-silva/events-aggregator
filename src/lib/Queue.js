import BeeQueue from 'bee-queue';
import meetupSubscriptionMail from '../app/jobs/MeetupSubscriptionMail';
import redisConfig from '../config/redis';

const jobs = [meetupSubscriptionMail];

class Queue {
  constructor() {
    this.queues = [];
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues.push({
        key,
        beeQueue: new BeeQueue(key, {
          redis: redisConfig,
        }),
        handle,
      });
    });
  }

  addJob(key, data) {
    const queueInfo = this.queues.find(queue => queue.key === key);
    queueInfo.beeQueue.createJob(data).save();
  }

  processJobs() {
    this.queues.forEach(queue => {
      queue.beeQueue.on('failed', this.handleFailedJobs).process(queue.handle);
    });
  }

  handleFailedJobs(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
