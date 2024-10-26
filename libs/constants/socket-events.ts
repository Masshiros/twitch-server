export const SocketEvents = {
  Notification: {
    NEW_NOTIFICATION: "newNotification",
    GET_NOTIFICATIONS: "getNotifications",
    MARK_AS_READ: "markAsRead",
  },
  Chat: {
    SEND_MESSAGE: "sendMessage",
    RECEIVE_MESSAGE: "receiveMessage",
    USER_TYPING: "userTyping",
    USER_STOP_TYPING: "userStopTyping",
  },
  User: {
    USER_CONNECTED: "userConnected",
    USER_DISCONNECTED: "userDisconnected",
  },
}
