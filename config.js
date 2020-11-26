module.exports = {
  'secret': process.env.SECRET,
  'namespace': process.env.NAMESPACE,
  'database': {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT || 5432,
    database: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    ssl: process.env.DB_SSL || false,
    timeout: 20, max: 10,
  },
  'devuser': {
    'username': process.env.DEV_USERNAME || null,
    'password': process.env.DEV_PASSWORD || null
  }
};