const crypto = require('crypto')

const encrytpPassword = async (txt, salt = null) => {
  if (!salt) {
    salt = await crypto.randomBytes(50)
    salt = salt.toString('hex')
  }
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(txt, salt.toString(), 100000, 128, 'sha512', (err, derivedKey) => {
      if (err) return reject(new Error(err))
      resolve({ salt, encode: derivedKey.toString('hex') })
    })
  })
}

module.exports = {
  encrytpPassword
}
