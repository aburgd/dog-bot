#! /usr/bin/env node
import {Client} from 'discord.js'
import config from '../config'
import {onMessage, onGuildMemberAdd, onGuildMemberRemove} from './handler'
import {randomInt} from './utils'

/* eslint-disable prefer-destructuring */
const token = process.env.BOT_TOKEN || config.token || 'BOT_TOKEN'
const prefix = config.prefix || '+'
/* eslint-enable prefer-destructuring */

const talkedRecently = new Set()

if (token === null || token.length === 0 || token === 'BOT_TOKEN') {
  const missingToken = new Error('ERR - replace "BOT TOKEN" in config.js with your bot\'s token')
  console.error(missingToken)
  throw missingToken
}

const client = new Client()

client.on('ready', () => {
  console.log('READY')
  const activities = ['with dogs', 'isomorphic-fetch', 'snekfetch']
  const random = randomInt(0, activities.length)
  const activity = activities[random]
  client.user.setActivity(activity)
})

client.on('guildMemberAdd', member => {
  onGuildMemberAdd(member, client)
})

client.on('guildMemberRemove', member => {
  onGuildMemberRemove(member)
})

client.on('message', message => {
  // eslint-disable-next-line prefer-destructuring
  const content = message.content
  if (!content.startsWith(prefix)) return null

  if (talkedRecently.has(message.author.id)) return null
  talkedRecently.add(message.author.id)
  setTimeout(() => {
    talkedRecently.delete(message.author.id)
  }, 2500)

  onMessage(message, client)
})

client.login(token)
