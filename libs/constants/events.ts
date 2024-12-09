export const Events = {
  image: {
    multiple_upload: "images.upload",
  },
  notification: "emit.notification",
  notification_all: "all.notification",
  friend_request: {
    send: "friend-request.send",
    accept: "friend-request.accept",
    reject: "friend-request.reject",
    list: "friend-request.list",
  },
  friend: {
    list: "friend-list",
  },
  post: {
    create: "post.create",
    update: "post.update",
    delete: "post.delete",
  },
  comment: {
    create: "comment.create",
    update: "comment.update",
    delete: "comment.delete",
  },
  conversation: {
    create: "conversation.create",
    list: "conversation.list",
  },
  message: {
    create: "message.create",
  },
}
