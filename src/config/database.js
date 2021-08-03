module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'riderize',
  database: 'riders',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
