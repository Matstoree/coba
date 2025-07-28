import os from 'os'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix: _p, args }) => {
  try {
    let userData = global.db?.data?.users[m.sender] || {}
    let nama = userData.nama || m.pushName || 'PENGGUNA'
    let exp = userData.exp || 0
    let koin = userData.koin || 0
    let limit = userData.limit || 0

    if (userData.premium && Number(userData.premiumTime || 0) <= Date.now()) {
      userData.premium = false
      userData.premiumTime = 0
    }

    let isOwner = Array.isArray(global.owner) ? global.owner.some(([id]) => m.sender.includes(id)) : false
    let isPremium = userData.premium === true && Number(userData.premiumTime || 0) > Date.now()
    let status = isOwner ? '👑 Owner' : isPremium ? '💎 Premium' : '👤 Tidak Premium'
    let sisaPremium = isPremium ? getRemainingTime(userData.premiumTime - Date.now()) : '-'

    let now = new Date()
    let locale = 'id'
    let hari = now.toLocaleDateString(locale, { weekday: 'long', timeZone: 'Asia/Jakarta' })
    let tanggal = now.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
    let uptime = clockString(process.uptime() * 1000)

    let dbSize = (() => {
      try {
        let stats = fs.statSync('./database.json')
        return formatBytes(stats.size)
      } catch {
        return 'Tidak tersedia'
      }
    })()

    let pkg = JSON.parse(fs.readFileSync('./package.json'))
    let libVersion = pkg.dependencies['@whiskeysockets/baileys'] || 'Unknown'

    let menuBot = `
乂  *I N F O R M A S I   B O T*  乂
┏───────────────┈ ⟢
┆    *ɴᴀᴍᴀ ʙᴏᴛ* : ${global.namebot}
┗┬──────────────┈ ⟢
┏┆•❃ *Library*  : @whiskeysockets/baileys ${libVersion}
┆┆•❃ *Prefix*   : ${_p}
┆┆•❃ *Platform* : ${os.platform()}
┆┆•❃ *Uptime*   : ${uptime}
┆┆•❃ *Tanggal*  : ${hari}, ${tanggal}
┆┆•❃ *Pengguna* : ${Object.keys(global.db?.data?.users || {}).length}
┆┆•❃ *Database* : ${dbSize}
╎╰──────────────┈ ⟢
┗───────────────┈ ⟢
`.trim()

    let menuUser = `
乂  *I N F O R M A S I   P E N G G U N A*  乂
┏───────────────┈ ⟢
┆    *ɴᴀᴍᴀ* : ${nama}
┗┬──────────────┈ ⟢
┏┆•❃ *Status*    : ${status}
┆┆•❃ *Exp*       : ${exp}
┆┆•❃ *Koin*      : ${koin}
┆┆•❃ *Limit*     : ${limit}
┆┆•❃ *Premium*   : ${sisaPremium}
╎╰──────────────┈ ⟢
┗───────────────┈ ⟢
`.trim()

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        owner: plugin.owner,
        rowner: plugin.rowner
      }))

    let categories = {}
    help.forEach(plugin => {
      plugin.tags.forEach(tag => {
        if (!(tag in categories) && tag) categories[tag] = tag
      })
    })

    if (args[0]) {
      let category = args[0].toLowerCase()
      if (category in categories) {
        let commands = help
          .filter(menu => menu.tags.includes(category) && menu.help)
          .map(menu => menu.help.map(cmd => {
            let marks = ''
            if (menu.limit) marks += 'Ⓛ '
            if (menu.premium) marks += 'Ⓟ '
            if (menu.owner || menu.rowner) marks += 'Ⓞ '
            return `• ${menu.prefix ? cmd : `${_p}${cmd}`} ${marks}`.trim()
          }).join('\n')).join('\n')

        let menuContent = `
乂  *M E N U  ${category.toUpperCase()}*  乂
┏━━━━━━━━━━━━━━━━━⟢
${commands}
┗━━━━━━━━━━━━━━━━━⟢
`.trim()

        let fkon = {
          key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast'
          },
          message: {
            imageMessage: {
              mimetype: 'image/jpeg',
              caption: 'Menu Bot',
              jpegThumbnail: Buffer.alloc(0)
            }
          }
        }

        await conn.sendMessage(m.chat, {
          image: { url: global.fotonya },
          caption: `👤 *${nama}*\n\n${menuContent}`
        }, { quoted: fkon })
        return
      } else {
        m.reply(`⚠️ Kategori *${args[0]}* tidak ditemukan.\nGunakan *${_p}menu* untuk melihat daftar.`)
        return
      }
    }

    let categoryList = Object.keys(categories).map(tag => `⟢ ${_p}menu ${tag}`).join('\n')

    let mainMenu = `
${getGreeting()}, *${nama}!*\n\n${menuBot}\n\n${menuUser}\n\n乂  *D A F T A R   M E N U* 乂
┏━━━━━━━━━━━━━━━⟢
${categoryList}
┗━━━━━━━━━━━━━━━⟢

╭──❑ 「 *Cara Menggunakan Menu* 」
│ ⟢ Ketik:  ${_p}menu <nama_kategori>
│ ⟢ Contoh: ${_p}menu downloader
│
│ ⟢ *Keterangan*: 
│ Ketik perintah di atas untuk melihat 
│ daftar fitur di dalam kategori tersebut.
╰❑

${global.wm} 𝟐𝟎𝟐𝟓
`.trim()

    let fkon = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        imageMessage: {
          mimetype: 'image/jpeg',
          caption: 'Menu Bot',
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    }

    await conn.sendMessage(m.chat, {
      image: { url: global.fotonya },
      caption: mainMenu
    }, { quoted: fkon })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Terjadi kesalahan saat menampilkan menu.')
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|bot)$/i
handler.daftar = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getGreeting() {
  let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  let hour = new Date(d).getHours()
  if (hour >= 4 && hour < 10) return 'Selamat pagi'
  if (hour >= 10 && hour < 15) return 'Selamat siang'
  if (hour >= 15 && hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

function getRemainingTime(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${d}h ${h}j ${m}m ${s}d`
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  let units = ['KB', 'MB', 'GB']
  let i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i - 1]
}