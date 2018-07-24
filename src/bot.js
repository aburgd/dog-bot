// @flow
import { Client, GuildChannel, Message, RichEmbed } from 'discord.js'
import fetch from 'isomorphic-fetch'
import config from '../config'

const token = process.env.BOT_TOKEN || config.token
const prefix: string = config.prefix
const dogUrl: string = config.dogUrl

if (token === 'BOT TOKEN') {
  console.error('ERR - replace "BOT TOKEN" in config.js with your bot config.token')
  process.exit(1)
}

const client: Client = new Client()

client.on('ready', () => {
  console.log('READY')
  client.user.setActivity('with dogs')
})

client.on('message', (message: Message) => {
  if (!message.content.startsWith(prefix)) return null
  if (message.content === `${prefix}`) dog(message)
  if (message.content === `${prefix}s`) dogs(message)
})

// $FlowIgnore
client.login(token)

async function dog (msg: Message): Promise<any> {
  fetch(dogUrl)
    .then((data: Response) => data.json())
    .then((json: any) => json.message)
    .then((url: string) => buildEmbed(url))
    .then((embed: RichEmbed) => msg.channel.send({ embed }))
}

async function dogs (msg: Message): Promise<any> {
  fetch(`${dogUrl}/3`)
    .then((data: Response) => data.json())
    .then((json: any) => json.message)
    .then((message: Array<string>) => {
      message.forEach((url: string) => {
        msg.channel.send(buildEmbed(url))
      })
    })
    .catch((exc) => {
      msg.reply('Sorry, couldn\'t quite get that')
      console.error(exc)
    })
}

const buildEmbed = (url: string): RichEmbed => new RichEmbed({ image: { url } })

// function buildEmbed (url: string): RichEmbed {
//   return new RichEmbed({ image: { url } })
// }
