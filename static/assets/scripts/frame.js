const iframe = document.getElementById('ifra')
window.addEventListener('resize', navigator.keyboard.lock(['Escape']))
// Decode URL
function decodeXor(input) {
  if (!input) return input
  let [str, ...search] = input.split('?')

  return (
    decodeURIComponent(str)
      .split('')
      .map((char, ind) => (ind % 2 ? String.fromCharCode(char.charCodeAt(NaN) ^ 2) : char))
      .join('') + (search.length ? '?' + search.join('?') : '')
  )
}
function iframeLoad() {
  if (document.readyState === 'complete') {
    const website = iframe.contentWindow?.location.href.replace(window.location.origin, '')

    if (website.includes('/y/') || website.includes('/f/')) {
      document.getElementById('is').value = '.'
    } else if (website.includes('/a/')) {
      const website = iframe.contentWindow?.location.href.replace(window.location.origin, '').replace('/a/', '')
      document.getElementById('is').value = decodeXor(website)
      localStorage.setItem('decoded', decodeXor(website));
      window.parent.postMessage({ decodedSet: true }, '*');
    } else if (website.includes('/a/q/')) {
      const website = iframe.contentWindow?.location.href.replace(window.location.origin, '').replace('/a/q/', '')
      document.getElementById('is').value = decodeXor(website)
      localStorage.setItem('decoded', decodeXor(website));
      window.parent.postMessage({ decodedSet: true }, '*');
    }
  }
}


// Reload
function reload() {
  if (iframe) {
    iframe.src = iframe.src
  }
}
// Popout
function popout() {
  const newWindow = window.open('about:blank', '_blank')

  if (newWindow) {
    const name = localStorage.getItem('name') || 'My Drive - Google Drive'
    const icon = localStorage.getItem('icon') || 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'

    newWindow.document.title = name

    const link = newWindow.document.createElement('link')
    link.rel = 'icon'
    link.href = encodeURI(icon)
    newWindow.document.head.appendChild(link)

    const newIframe = newWindow.document.createElement('iframe')
    const style = newIframe.style
    style.position = 'fixed'
    style.top = style.bottom = style.left = style.right = 0
    style.border = style.outline = 'none'
    style.width = style.height = '100%'

    newIframe.src = iframe.src

    newWindow.document.body.appendChild(newIframe)
  }
}
// Eruda
function erudaToggle() {
  if (!iframe) return

  const erudaWindow = iframe.contentWindow
  const erudaDocument = iframe.contentDocument

  if (!erudaWindow || !erudaDocument) return

  if (erudaWindow.eruda?._isInit) {
    erudaWindow.eruda.destroy()
  } else {
    let script = erudaDocument.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.onload = function () {
      if (!erudaWindow) return
      erudaWindow.eruda.init()
      erudaWindow.eruda.show()
    }
    erudaDocument.head.appendChild(script)
  }
}
// Fullscreen
const fullscreenButton = document.getElementById('fullscreen-button')
fullscreenButton.addEventListener('click', function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
// Home
const homeButton = document.getElementById('home-page')
homeButton.addEventListener('click', function () {
  window.location.href = './'
})
// Back
function goBack() {
  if (iframe) {
    iframe.contentWindow.history.back()
  } else {
    console.error('No iframe found')
  }
}
// Forward
function goForward() {
  if (iframe) {
    iframe.contentWindow.history.forward()
  } else {
    console.error('No iframe found')
  }
}
// Iframe
window.onload = function () {
  let GoUrl = sessionStorage.getItem('GoUrl')
  let dyValue = localStorage.getItem('dy')

  if (!GoUrl.startsWith('/y/') && !GoUrl.startsWith('/f/')) {
    if (dyValue === 'true' || dyValue === 'auto') {
      GoUrl = '/a/q/' + GoUrl
    } else {
      GoUrl = '/a/' + GoUrl
    }
  }
  console.log(GoUrl)
  if (iframe) {
    iframe.src = GoUrl
  }
}

// Remove Nav
document.addEventListener('fullscreenchange', function () {
  const isFullscreen = Boolean(document.fullscreenElement)
  document.body.classList.toggle('fullscreen', isFullscreen)
})
// Now
const key = ['nowgg', 'now.gg'];
const decoded = localStorage.getItem('decoded');
let decodedSet = false;

window.addEventListener('message', function(event) {
  if (event.data && event.data.decodedSet === true) {
    decodedSet = true;
    console.log('Starting process.');
    now(); 
  }
});

function now() {
  if (decoded) {
    let found = false;
    for (const keyword of key) {
      if (decoded.includes(keyword)) {
        console.log(`${keyword} found`);
        found = true;
        break;
      }
    }
    if (found) {
      let count = 0;
      let notfound = 0;
      const limit = 10;
      const max = 35;
      const reloadInterval = setInterval(() => {
        if (count < limit && iframe) {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          const element = iframeDocument.querySelector('.sc-hGPBjI.gGkQpt');
          if (element) {
            console.log("Unsafe proxy or VPN detected. Reloading...");
            iframe.contentWindow.location.reload();
            count += 1;
            notfound = 0; 
          } else {
            console.log("Class not found inside the iframe.");
            notfound += 1;
            if (notfound >= max) {
              console.log(`Class not found for ${max} consecutive checks. Stopping.`);
              clearInterval(reloadInterval);
            }
          }
        } else {
          clearInterval(reloadInterval);
        }
      }, 500);
    }
  } else {
    console.log('Decoded not found in localStorage.');
  }
}

if (decodedSet) {
  now();
}
