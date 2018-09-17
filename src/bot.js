#! /usr/bin/env node

/* eslint curly: ["error", "multi-line"] */
import {Client, Collection} from 'discord.js'
import config from '../config'
import {dog} from './utils'

/* eslint-disable prefer-destructuring */
const token = process.env.BOT_TOKEN || config.token || 'BOT TOKEN'
const prefix = config.prefix || '+'
const inviteUrl = config.inviteUrl || 'INVITE URL'
const ownerId = config.ownerId || 000000000000000000
/* eslint-enable prefer-destructuring */

const talkedRecently = new Set()
const newUsers = []

if (token === null || token.length === 0) {
  const missingToken = new Error('ERR - replace "BOT TOKEN" in config.js with your bot\'s token')
  console.error(missingToken)
  throw missingToken
}

const client = new Client()

client.on('ready', () => {
  console.log('READY')
  client.user.setActivity('with dogs')
})

client.on('guildMemberAdd', member => {
  const guild = member[guild]
  if (!newUsers[guild.id]) newUsers[guild.id] = new Collection()
  newUsers[guild.id].set(member.id, member.user)

  if (newUsers[guild.id].size > 10) {
    const userList = newUsers[guild.id].map(user => user.toString())
    guild.channels.find('name', 'general').send('Hewwo!\n' + userList)
    newUsers[guild.id].clear()
  }
})

client.on('guildMemberRemove', member => {
  const guild = member[guild]
  if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id)
})

client.on('message', message => {
  /* eslint-disable prefer-destructuring */
  const content = message.content
  /* eslint-enable prefer-destructuring */
  if (!content.startsWith(prefix)) return null

  if (talkedRecently.has(message.author.id)) return null
  talkedRecently.add(message.author.id)
  setTimeout(() => {
    talkedRecently.delete(message.author.id)
  }, 2500)

  const args = content.slice(prefix.length).trim().split(/ +/g)
  // eslint-disable-next-line no-unused-vars
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
    case 'off': {
      if (Number(message.author.id) === ownerId) {
        message.channel.send('Powering off!')
        process.exit(0)
      } else {
        message.channel.send('You don\'t have permission for this!')
      }
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
})

client.login(token)
