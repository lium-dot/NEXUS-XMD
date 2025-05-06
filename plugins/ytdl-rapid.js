const config = require('../config'); 
const { cmd } = require('../command');
const fetch = require("node-fetch");

cmd({
    pattern: "ytv3",
    alias: ["ytvideo3", "vid3", "song3"],
    react: "📹",
    desc: "Search & download YouTube video",
    category: "main",
    use: '.ytv3 < video name or YouTube URL >',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a YouTube URL or video name.*");

        // Step 1: Get YouTube URL from search or use input
        let ytUrl = q;
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const searchRes = await fetch(`https://ytapi.replit.app/search?q=${encodeURIComponent(q)}`);
            const searchData = await searchRes.json();
            if (!searchData || !searchData[0] || !searchData[0].url) {
                return reply("*No video found for your search.*");
            }
            ytUrl = searchData[0].url;
        }

        // Step 2: Call the new working RapidAPI endpoint
        let response = await fetch(`https://youtube-video-download-api1.p.rapidapi.com/?url=${encodeURIComponent(ytUrl)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'youtube-video-download-api1.p.rapidapi.com',
                'x-rapidapi-key': '27d1373c05msh7263e9f2c77c984p10380bjsn228f61b64aab'
            }
        });

        let data = await response.json();
        if (!data || !data.link) return reply("*Download link not found. Try another video.*");

        // Step 3: Send result
        let caption = `*『 YᴏᴜTᴜʙᴇ ⇆ Vɪᴅᴇᴏ 』*

*➤ Title:* ${data.title || "Unknown"}
*➤ Quality:* ${data.quality || "Standard"}
*➤ Size:* ${data.size || "Unknown"}
*➤ Link:* ${ytUrl}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ *SHABAN-MD*`;

        await conn.sendMessage(from, {
            video: { url: data.link },
            mimetype: "video/mp4",
            caption
        }, { quoted: mek });

    } catch (err) {
        console.log("ytv3 error:", err);
        reply("*Something went wrong while processing your request.*");
    }
});