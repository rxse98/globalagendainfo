function clickInfo() {
    let text = document.getElementById("text")
    text.innerText = "\"More info: "
    
    let link = document.createElement('a')
    link.innerText = "*LINK* \""
    link.href = "https://discord.me/GA1"
    text.appendChild(link)
}

function clickRefresh() {
    var HOST = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(HOST);

    ws.onmessage = (event) => {
        let text = document.getElementById("text")
        text.innerText = event.data
    }
}

function clickPrivate() {
    let text = document.getElementById("text")
    text.innerText = "\"Now, we can't make a private server, no one has the server-side files, but you can help us to recreate them, Agent.\""
}