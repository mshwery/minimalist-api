import sendGrid from '@sendgrid/mail'
import { EmailData } from '@sendgrid/helpers/classes/email-address'
import EmailTemplate from 'email-templates'
import config from '../../config'

sendGrid.setApiKey(config.get('SENDGRID_API_KEY'))

const emailTemplate = new EmailTemplate({ message: {} })

const defaultFrom = {
  email: 'no-reply@getminimalist.com',
  name: 'minimalist',
}

export const categories = {
  account: 12767,
  collaboration: 12768,
}

interface SendEmailOptions {
  category: keyof typeof categories
  to: EmailData
  from?: EmailData
  replyTo?: EmailData
  template: string
  data?: any
}

/**
 * Send an email using a given template. `data` is passed to the template(s)
 * Templates can be found under `./emails/<template>/{html,subject,text}.pug`
 */
export async function sendEmail({ category, to, from = defaultFrom, replyTo, template, data }: SendEmailOptions) {
  // @ts-ignore types don't include `renderAll` yet and I can't easily augment it
  const { subject, text, html } = await emailTemplate.renderAll(template, data)

  return sendGrid.send({
    to,
    from,
    replyTo,
    text,
    // default sendgrid template for minimalist
    templateId: 'd-49c3d73ce4794fea8bed08e1382514b3',
    dynamicTemplateData: {
      subject,
      content: html,
    },
    asm: {
      groupId: categories[category] || categories.account,
    },
    mailSettings: {
      sandboxMode: {
        enable: config.get('SENDGRID_SANDBOX_MODE') === true,
      },
    },
  })
}

export default sendGrid
