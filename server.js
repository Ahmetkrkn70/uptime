require("express")().listen(1343);

const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
client.login("NzE5MjMwMDEzOTc0NTExNjQ4.Xt0ZJQ.hHALx6sChUKGy7yQBWI8nngSfAo");
const fetch = require("node-fetch");
const fs = require("fs");

setInterval(() => {
  var links = db.get("linkler");
  if (!links) return;
  var linkA = links.map(c => c.url);
  linkA.forEach(link => {
    try {
      fetch(link);
    } catch (e) {
      console.log("" + e);
    }
  });
  console.log("Başarıyla Pinglendi.");
}, 60000);

client.on("ready", () => {
  if (!Array.isArray(db.get("linkler"))) {
    db.set("linkler", []);
  }
});

client.on("ready", () => {
  client.user.setActivity(
    `k!yardım| ${db.get("linkler").length} / ${client.guilds.size}`
  );
  console.log(`Logined`);
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "k!ekle") {
    var link = spl[1];
    fetch(link)
      .then(() => {
        if (
          db
            .get("linkler")
            .map(z => z.url)
            .includes(link)
        )
          return message.channel.send(
            "<:negative_squared_cross_mark:732219380795965471> Zaten Eklenmiş!"
          );
        message.channel.send("<:white_check_mark:732219381085503529> Başarılı!");
        db.push("linkler", { url: link, owner: message.author.id });
      })
      .catch(e => {
        return message.channel.send("<:negative_squared_cross_mark:732219380795965471> " + e);
      });
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "k!botsay") {
    var link = spl[1];
    message.channel.send(`${db.get("linkler").length} / ${client.guilds.size}`);
  }
});

const Discord = require("discord.js");

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "k!yardım") {
    let embed = new Discord.RichEmbed()
      .setColor("#4ca74c")
      .addField(
        `Uptime Bot v1.0 Yardım`,
        `Bot glitch sitelerinin 7/24 açık çalışmasını sağlayan bir sistem içerir. Sistemdeki bağlantılar herhangi bir bakım gerektirmeden 7/24 çalışır.`
      )
      .addField(
        `Genel Komutlar`,
        `

\`k!yardım\` - Yardım Menüsünü Gösterir.
\`k!ekle\` - Sisteme Bot Eklersiniz.
\`k!botsay\` - Sistemde Kaç Bot Olduğunu Listeler.
`
      )
      .addField(
        `Link`,
        `[K R K N ](https://discord.gg/h4sRemk)
[Botumuzu Ekleyin](https://discord.com/oauth2/authorize?client_id=719230013974511648&scope=bot&permissions=8)
[Destek Sunucumuz](https://discord.gg/h4sRemk)`
      )
      .setThumbnail(client.user.avatarURL)
      .setAuthor(`Uptime`, client.user.avatarURL)
      .setFooter(`2020 © Uptime`, client.user.avatarURL);
    return message.channel.send(embed);
  }
});

client.on("message", async message => {
  if (!message.content.startsWith("u.eval")) return;
  if (!["713137083610431571", "713137083610431571"].includes(message.author.id))
    return;
  var args = message.content.split("u.eval")[1];
  if (!args) return message.channel.send("<:asuna_no:732219380795965471> ..");

  const code = args;

  function clean(text) {
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 3 });
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }

  var evalEmbed = "";
  try {
    var evaled = await clean(await eval(await code));
    if (evaled.constructor.name === "Promise")
      evalEmbed = `\`\`\`\n${evaled}\n\`\`\``;
    else evalEmbed = `\`\`\`js\n${evaled}\n\`\`\``;

    if (evaled.length < 1900) {
      message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
    } else {
      var hast = await require("hastebin-gen")(evaled, {
        url: "https://hasteb.in"
      });
      message.channel.send(hast);
    }
  } catch (err) {
    message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
  }
});

const log = message => {
  console.log(`${message}`);
};
