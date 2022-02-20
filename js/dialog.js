function clickInfo() {
    let text = document.getElementById("text")
    text.innerText = "\"More info: discord.me/GA1, Agent.\""
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