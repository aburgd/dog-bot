// Utils for bot.js
import {RichEmbed} from 'discord.js'
import fetch from 'isomorphic-fetch'
import {dogUrl} from '../config'

const splitUrls = urlString => urlString.split(/,+/g)
const buildEmbed = url => new RichEmbed({image: {url}})

/* eslint-disable require-await */
export async function dog(msg, num) {
  fetch(`${dogUrl}/${num}`)
    .then(data => data.json())
    .then(json => Array.of(json.message))
    .then(message => {
      message.forEach(url => {
        url = url.toString()
        const urls = splitUrls(url)
        const embeds = new Array(urls.length)
        urls.forEach(url => {
          embeds.push(buildEmbed(url))
        })
        embeds.forEach(embed => {
          msg.channel.send(embed)
        })
      })
    })
    .catch(error => {
      msg.channel.send('Sorry, couldn\'t quite get that.')
      throw error
    })
}
/* eslint-enable require-await */

export function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
