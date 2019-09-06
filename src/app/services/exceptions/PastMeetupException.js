class PastMeetupException extends Error {
  constructor(message) {
    super(message);
    this.name = 'PastMeetupException';
  }
}

export default PastMeetupException;
