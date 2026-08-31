// src/utils/share.js
// Helpers za kushare links kwenye mitandao ya kijamii

// Origin inachukuliwa AUTOMATICALLY kutoka kwenye address bar (window.location.origin)
export const getShareOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export const shareWhatsApp = (text) => {
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener')
}

export const shareFacebook = (url) => {
  const shareUrl = encodeURIComponent(url)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'noopener')
}

export const shareTelegram = (text) => {
  const encoded = encodeURIComponent(text)
  window.open(`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encoded}`, '_blank', 'noopener')
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(textArea)
    }
    return true
  }
}
