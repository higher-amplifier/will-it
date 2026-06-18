const cron = require('node-cron')
const crypto = require('crypto')
const User = require('../models/User')
const Will = require('../models/Will')
const { sendCheckinReminder, sendWillToNominee } = require('../utils/mailer')
const { decrypt } = require('../utils/encryption')

cron.schedule('0 9 * * *', async () => {
  console.log('Running dead man switch check...')

  const users = await User.find({ isActive: true, triggerFired: false })

  for (const user of users) {
    const daysSinceCheckin = Math.floor(
      (Date.now() - new Date(user.lastCheckin).getTime()) / (1000 * 60 * 60 * 24)
    )

    const reminderDay = Math.floor(user.checkinInterval * 0.8)

    if (daysSinceCheckin >= user.checkinInterval) {
      const wills = await Will.find({ user: user._id, isDelivered: false })
      if (!wills.length) continue

      const decryptedWills = wills.map(w => ({
        title: w.title,
        content: decrypt(w.encryptedContent),
      }))

      const nomineeEmail = wills[0].nomineeEmail
      const nomineeName = wills[0].nomineeName

      try {
        await sendWillToNominee(
          { email: nomineeEmail, name: nomineeName },
          user.name,
          decryptedWills
        )
        await Will.updateMany({ user: user._id }, { isDelivered: true, deliveredAt: new Date() })
        await User.findByIdAndUpdate(user._id, { triggerFired: true })
        console.log(`Will delivered for ${user.email}`)
      } catch (err) {
        console.error(`Failed to deliver will for ${user.email}:`, err.message)
      }

    } else if (daysSinceCheckin >= reminderDay) {
      const token = crypto.randomBytes(32).toString('hex')
      await User.findByIdAndUpdate(user._id, { checkinToken: token })
      const checkinLink = `${process.env.CLIENT_URL}/checkin/${token}`
      try {
        await sendCheckinReminder(user, checkinLink)
        console.log(`Reminder sent to ${user.email}`)
      } catch (err) {
        console.error(`Failed to send reminder to ${user.email}:`, err.message)
      }
    }
  }
})
