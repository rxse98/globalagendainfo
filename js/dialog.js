function clickRefresh() {
    var ws = new WebSocket("wss://" + process.env.IP + ":" + process.env.PORT)

    ws.onmessage = (event) => {
        let text = document.getElementById("text")
        text.innerText = event.data
    }
    
    ws.onclose = () => {
        console.log("onclose")
    }
}

function clickPrivate() {
    let text = document.getElementById("text")
    text.innerText = "\"Now, we can't make a private server, no one has the server-side files, but you can help us to recreate them, Agent.\""
}