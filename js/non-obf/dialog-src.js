// onClick: Info
function clickInfo() {
    // change dialog text
    let text = document.getElementById("text")
    text.innerText = "\"Want to know more info? Join us: "
    
    // add discord link to text
    let link = document.createElement("a")
    link.classList.add("link")
    link.innerText = "*LINK*"
    link.href = "https://discord.me/GA1"
    text.appendChild(link)

    // add text after discord link
    let text2 = document.createElement("label")
    text2.innerText = " , Agent.\""
    text.appendChild(text2)
}

// onClick: Refresh server status
function clickOfficialRefresh() {
    // ws client route to connect, ws server host = express server host, difference is that we should replace http on ws
    var HOST = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(HOST);

    // ws client sending request to ws server on connect
    ws.onopen = () => {
        console.log("Websocket sending request.")
        // ws client sends request to ws server about refreshing GA server status
        ws.send("official")
    }

    // ws client receives response from ws server about GA server status
    ws.onmessage = (event) => {
        console.log("Websocket client received data.")
        // change dialog text
        let text = document.getElementById("text")
        text.innerText = event.data
    }
}

// onClick: Private Servers
function clickPrivate() {
    // change dialog text
    let text = document.getElementById("text")
    text.innerText = "\"Now, we can't make a private server, no one has the server-side files, but you can help us to recreate them, Agent.\""
}