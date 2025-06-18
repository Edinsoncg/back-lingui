import { defineConfig } from '@adonisjs/mail'
import env from '#start/env'

const mailConfig = defineConfig({
  default: env.get('MAIL_DRIVER'),

  mailers: {
    log: {
      driver: 'log',
    },
  },

  from: {
    address: env.get('MAIL_FROM_ADDRESS'),
    name: 'Lingui App',
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
