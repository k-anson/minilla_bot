import EZ from 'eznv'

export default EZ.Schema({
  CLIENT_TOKEN: EZ.String(),

  DATABASE_HOST: EZ.String(),
  DATABASE_PORT: EZ.Number(),
  DATABASE_USERNAME: EZ.String(),
  DATABASE_PASSWORD: EZ.String(),
  DATABASE_NAME: EZ.String()
})