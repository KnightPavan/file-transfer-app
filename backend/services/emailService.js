import nodemailer from 'nodemailer'

export default async function sendMail ({ from, to, subject, text, html }) {
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })
  let info = await transport.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html
  })
  console.log(info)
}
