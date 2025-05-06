const config = require('../config'); 
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 

cmd({ 
    pattern: "yta4", 
    alias: ["ytaa4", "song4"], 
    react: "🎵", 
    desc: "Download Youtube audio", 
    category: "main", 
    use: '.mp3 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("*𝐏ℓєαʂє 𝐏ɼ๏νιɖє 𝐀 𝐘ᴛ 𝐔ɼℓ ๏ɼ 𝐒ᴏɴɢ 𝐍αмє..*");

        let apiUrl = `https://common-evangelina-mrshabankha-b7051a83.koyeb.app/yta?q=${encodeURIComponent(q)}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.download_url) {
            return reply("Failed to fetch the audio. Please try again later.");
        }

        let msg = `*『 YᴏᴜTᴜʙᴇ ⇆ Aᴜᴅɪᴏ 』*

*➤ Title:* ${data.title}
*➤ Duration:* ${data.duration}
*➤ Creator:* ${data.creator}
*➤ Link:* ${q}

▸ ᴘᴏᴡᴇʀᴇᴅ ʙʏ *SHABAN-MD*`;

        // Send thumbnail + caption
        await conn.sendMessage(from, { image: { url: data.thumbnail || '' }, caption: msg }, { quoted: mek });
        
        // Send audio file
        await conn.sendMessage(from, { audio: { url: data.download_url }, mimetype: "audio/mp4" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});