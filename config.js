import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

// Owner
global.owner = [
['6282191987064', 'ItsMeMatt', true],
]
global.mods = []
global.prems = []
// Info
global.nomorwa = '6282191987064'
global.packname = '𝐌𝐚𝐝𝐞 𝐖𝐢𝐭𝐡'
global.author = '© 𝐂𝐨𝐩𝐲𝐫𝐢𝐠𝐡𝐭 𝐌𝐚𝐭𝐬𝐓𝐨𝐫𝐞𝐞 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭'
global.namebot = '𝐌𝐚𝐭𝐬𝐓𝐨𝐫𝐞𝐞 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭'
global.wm = '𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐌𝐚𝐭𝐬𝐓𝐨𝐫𝐞𝐞 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭'
global.stickpack = '𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲'
global.stickauth = '© 𝐌𝐚𝐭𝐬𝐓𝐨𝐫𝐞𝐞 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭'
global.fotonya = 'https://i.postimg.cc/Gtj3L17S/thumbnail.jpg'
global.sgc = '_'
/*============== CPANEL ==============*/
global.domain = '' //domain
global.capikey = 'ptlc_X22C3SNqefYl2OF8NVazxxmBKBNwZO358ZUlo2pJ129' //ptlc
global.apikey = 'ptla_gMRewJ0I71xBtum1L6GmEEw0imEINUoedbWnuRkF9zM' //ptla
// Info Wait
global.wait = 'harap tunggu sebentar...'
global.eror = '⚠️ Terjadi kesalahan, coba lagi nanti!'
global.multiplier = 69 
// Apikey
global.lolkey = '',
global.neoxr = '';
global.lann = ''

// Catatan : Jika Mau Work Fiturnya
// Masukan Apikeymu
// Gapunya Apikey? Ya Daftar
global.APIs = {
    lolkey : "https://api.lolhuman.xyz",
    neoxr: 'https://api.neoxr.eu',
    lann: 'https://api.betabotz.eu.org'
}

/*Apikey*/
global.APIKeys = {
    "https://api.lolhuman.xyz": global.lolkey,
    "https://api.neoxr.eu": global.neoxr,
    'https://api.betabotz.eu.org': global.lann
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
