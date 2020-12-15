'use strict'
const nodemailer = require('nodemailer')
const serviceTemplate = require('../mailer/service_confirmation')

async function sendMail (to, subject, template) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'toctocnailsnoreplay@gmail.com',
      pass: 'T0cT0c12345'
      // user: process.env.USER_MAILER, // generated ethereal user
      // pass: process.env.PASSWORD_MAILER // generated ethereal password
    }
  })

  let info = await transporter.sendMail({
    from: 'TocTocMailer', // sender address
    to, // list of receivers
    subject, // Subject line
    html: template
  })

  return info
}

function sendOrderMailer (administrators, order) {
  const { user, services } = order
  const subject = 'Ha llegado una nueva orden'
  const template = serviceTemplate(user, services)
  return sendMail(administrators, subject, template)
}

module.exports = {
  sendMail,
  sendOrderMailer
}
