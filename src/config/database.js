module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'root',
  database: 'events_aggregator',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
