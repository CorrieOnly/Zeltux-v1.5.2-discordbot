const Discord = require("discord.js");
const YAWN = require('yawn-yaml/cjs')
const yaml = require('js-yaml')
const fs = require("fs")

exports.run = (client, message, args) => {
    message.delete()

    let statuss = ["LISTENING", "WATCHING", "PLAYING", "STREAMING"]

    let setType = function(type, bot, msg){
        bot.setDescription(client.l.management.setstatustype.type.replace('%TYPE%', `\`${type}\``))
        msg.edit(bot)
        client.user.setActivity(client.config.statusMessage, {type: `${type}`})
        let yawn = new YAWN( fs.readFileSync(`${process.cwd()}/config/config.yml`, 'utf8'));
        let myJson = yawn.json
        myJson["statusType"] = `"${type}"`
        yawn.json = myJson
        fs.writeFile(`${process.cwd()}/config/config.yml`, yawn.yaml, function (err) {
            if (err) return console.log(err)
        })
    }

    let bot = new Discord.MessageEmbed()
        .setColor(client.config.colour)
        .setTitle(client.l.management.config)
        .setDescription(`${client.l.management.setstatustype.pick}\nš - Listening\nšļø - Watching\nš® - Playing\nāÆļø - Streaming`)
        .setFooter(client.l.management.footer.replace('%SERVERNAME%', client.config.serverName).replace('%USER%', message.author.username))

    if(statuss.includes(args[0])) return message.channel.send(bot).then(msg => setType(args[0], bot, msg))
        
    const filter = (reaction, user) => {
        return ['š', 'šļø', 'š®', 'āÆļø'].includes(reaction.emoji.name) && user.id === message.author.id;
    }
    message.channel.send(bot).then(msg => {

        msg.react("š").then(() => msg.react("šļø").then(() => msg.react("š®").then(() => msg.react("āÆļø")))).then(() => {
            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first()
                if (reaction.emoji.name === 'š') {
                    setType("LISTENING", bot, msg)
                }
                else if (reaction.emoji.name === 'šļø'){
                    setType("WATCHING", bot, msg)
                }
                else if (reaction.emoji.name === 'š®'){
                    setType("PLAYING", bot, msg)
                }
                else if (reaction.emoji.name === 'āÆļø'){
                    setType("STREAMING", bot, msg)
                }

                msg.reactions.removeAll()
            })
        })

    })

}

// Ā© Zeltux Discord Bot | Do Not Copy