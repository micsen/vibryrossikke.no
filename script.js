function strtoarr(str) {
  return new TextEncoder().encode(str)
}

function arrtostr(arr) {
  return new TextDecoder().decode(arr)
}

function salt() {
  var vector = new Uint8Array(16)
  crypto.getRandomValues(vector)
  return Array.from(vector)
}

function encrypt(txt, pas, slt, fnc) {
  var vector = new Uint8Array(slt)
  crypto.subtle.digest({ name: 'SHA-256' }, strtoarr(pas)).then((res) => {
    crypto.subtle.importKey('raw', res, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']).then((key) => {
      crypto.subtle.encrypt({ name: 'AES-CBC', iv: vector }, key, strtoarr(txt)).then((res) => {
        fnc(Array.from(new Uint8Array(res)), Array.from(vector))
      })
    })
  })
}

function decrypt(cyp, pas, slt, fnc) {
  var data = new Uint8Array(cyp)
  var vector = new Uint8Array(slt)
  crypto.subtle.digest({ name: 'SHA-256' }, strtoarr(pas)).then((res) => {
    crypto.subtle.importKey('raw', res, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']).then((key) => {
      crypto.subtle.decrypt({ name: 'AES-CBC', iv: vector }, key, data).then((res) => {
        fnc(arrtostr(res))
      }, () => {
        fnc(null)
      })
    })
  })
}


const encLinks = {
  enc: {
    private: {
      salt: [226, 174, 184, 161, 122, 230, 12, 29, 100, 98, 148, 255, 157, 136, 169, 52],
      data: []
    }
  }
}

function buildLinks(links) {
  links.forEach((link) => {
    console.log(link)
    document.getElementById('links').innerHTML += `
                <a class="link" href="${link.link}" target="_blank">
                    <i class="${link.icon}">&nbsp;</i>${link.text}
                </a>`
  })
}

window.onload = function () {
  let links
  // public links
  buildLinks([
    {
      "text": "Instagram",
      "link": "https://www.instagram.com/elskeroslo/?locale=no",
      "icon": "fa-brands fa-instagram" // fontawesome icon
    }])
  try {
    // get query string
    var query = window.location.search.substring(1)
    console.log(query)
    // encrypt
    /*const clearText = JSON.stringify(links.private)
    encrypt(clearText, query, salt(), (ciphertext, salt) => {
        console.log(JSON.stringify(salt))
        const data = JSON.stringify(ciphertext);
        console.log(data)
    })*/

    //decrypt
    const key = query.split("=")[0]
    const enc = encLinks.enc[key]


    decrypt(enc.data, query, enc.salt, (plaintext) => {
      console.log(plaintext)

      links = JSON.parse(plaintext).links
      buildLinks(links)


    })
  } catch (error) {
  }


}
