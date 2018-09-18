#! /usr/bin/env node

/* eslint curly: ["error", "multi-line"] */
import {Client, Collection} from 'discord.js'
import config from '../config'
import onMessage from './handler'
import {randomInt} from './utils'

/* eslint-disable prefer-destructuring */
const token = process.env.BOT_TOKEN || config.token || 'BOT TOKEN'
const prefix = config.prefix || '+'
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
  const activities = ['with dogs', 'isomorphic-fetch', 'snekfetch']
  const random = randomInt(0, activities.length)
  const activity = activities[random]
  client.user.setActivity(activity)
})

client.on('guildMemberAdd', member => {
  // Get the guild of the new member
  const guild = member[guild]
  // Create a new Collection for each guild
  if (!newUsers[guild.id]) newUsers[guild.id] = new Collection()
  // Add the new Member to the guild's newUsers
  newUsers[guild.id].set(member.id, member.user)

  // After 10 new members, greet them and
  // clear the guild's new members Collection
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
  // eslint-disable-next-line prefer-destructuring
  const content = message.content
  if (!content.startsWith(prefix)) return null

  if (talkedRecently.has(message.author.id)) return null
  talkedRecently.add(message.author.id)
  setTimeout(() => {
    talkedRecently.delete(message.author.id)
  }, 2500)

  onMessage(message)
})

client.login(token)
