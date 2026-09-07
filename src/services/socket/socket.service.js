// services/socket.service.js
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(token = null) {
    if (this.socket) return

    // URL inachukuliwa automatically kutoka address bar ya browser.
    // Localhost/127.0.0.1 → backend ya dev (port 5000); live → same origin kama site
    const isLocal = /localhost|127\.0\.0\.1/.test(window.location.origin)
    const socketUrl = isLocal ? 'http://localhost:5000' : window.location.origin

    this.socket = io(socketUrl, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: token ? { token } : undefined
    })

    this.socket.on('connect', () => {
      console.log('[SOCKET] Connected to Live Betting Engine')
    })

    this.socket.on('disconnect', () => {
      console.warn('[SOCKET] Disconnected')
    })
  }

  // Listener ya Notification Mpya (kitambulisho cha user kilichotumwa upande wa server)
  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback)
    }
  }

  // Listener ya Mabadiliko ya Score (LIVE)
  onScoreUpdate(callback) {
    if (this.socket) {
      this.socket.on('match_score_update', callback)
    }
  }

  // Listener ya Mechi Ikimalizika (FINISHED)
  onMatchFinished(callback) {
    if (this.socket) {
      this.socket.on('match_finished', callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new SocketService()