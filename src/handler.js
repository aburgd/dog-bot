import {prefix, ownerId, inviteUrl} from '../config'
import {dog} from './utils'

export default function onMessage(message) {
  const args = message.content.slice(prefix.length).trim().split(/ +/g)

  const command = args.shift().toLowerCase()
  switch (command) {
    case 'dog': {
      const numDogs = args.length > 0 ? Number(args) : 1
      if (numDogs > 5) {
        message.channel.send('Please keep requests for doggos to a max of 5 at a time! Much thank!')
        console.error('ERR - Max Dogs')
      } else {
        dog(message, numDogs)
      }
      break
    }
    case 'offy': {
      if (Number(message.author.id) === ownerId) {
        message.channel.send('Powering off!')
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0)
      } else {
        message.reply('You\'re not my dad!')
      }
      break
    }
    case 'off': {
      if (Number(message.author.id) === ownerId) {
        console.log(message.author.id)
        message.reply(`Are you sure? Reply \`${prefix}offy\` to confirm!`)
      } else {
        message.channel.send('You don\'t have permission for this!')
      }
      break
    }
    case 'id': {
      message.author.send(`Your Discord User ID Snowflake is: ${message.author.id}`)
      break
    }
    case 'invite': {
      // eslint-disable-next-line prefer-destructuring
      const sender = message.author
      const senderPermissions = message.channel.permissionsFor(sender)
      if (senderPermissions.has('ADMINISTRATOR', false)) {
        sender.send(`Invite me using: ${inviteUrl}`)
        message.reply('Please check your DMs!')
      } else {
        message.channel.send('You don\'t have permissions to do that!')
      }
      break
    }
    default: {
      break
    }
  }
}
