var path
var url
var counter

self.onmessage = function (event) {
    url = event.data.url
    path = event.data.path
}

function sendPostRequest() {
    if (url && path) {
        fetch(`https://sockethook.ericbetts.dev/hook/${path}`, {
            method: 'POST',
            mode: "no-cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
            .then(data => console.log('Response:', data))
            .catch(error => console.error('Error:', error))
    }
    counter++
    postMessage(counter)
}
setInterval(sendPostRequest, 2000)