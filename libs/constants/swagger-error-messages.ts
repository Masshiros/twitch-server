export const SwaggerErrorMessages = {
  auth: {
    login: {
      badRequest: [
        "User name can not be empty",
        "Password can not be empty",
        "Password is wrong",
        "Your account has been deactivated. Reactivate your account",
        "Your account has not been verified. Please check your gmail to verify your account",
      ],
      notFound: ["User not found"],
    },
    registerWithEmail: {
      badRequest: [
        "Username can not be empty",
        "Username already exist",
        "Email can not be empty",
        "Email already exists",
        "Password can not be empty",
        "Invalid email, email must be in format xxx@yyyy.zzz",
        "Invalid password, it must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ],
    },
    registerWithPhone: {
      badRequest: [
        "Username can not be empty",
        "Username already exist",
        "Phone can not be empty",
        "Phone already exists",
        "Password can not be empty",
        "Invalid phone number. Please enter a valid phone number in the format: +123 (456) 789-0123 or 123-456-7890",
        "Invalid password, it must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ],
    },
    toggle2FA: {
      badRequest: ["Update user id can not be empty"],
      notFound: ["User not found"],
    },
    confirmEmail: {
      badRequest: [
        "OTP can not be empty",
        "User email has been already verified before",
        "Invalid OTP",
      ],
      notFound: ["User not found"],
    },
    resendConfirmEmail: {
      badRequest: [
        "User email has been already verified before",
        "Error happen when generate otp. Try again later",
      ],
      notFound: ["User not found"],
    },
    forgotPassword: {
      badRequest: ["EMAIL_OR_PHONE_CAN_NOT_BE_EMPTY"],
      notFound: ["User not found"],
    },
    resetPassword: {
      badRequest: [
        "Password can not be empty",
        "Invalid password, it must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character",
        "Confirm password can not be empty",
        "Confirm password and password do not match",
        "Forgot password token can not be empty",
        "Invalid token",
      ],
      notFound: ["User not found"],
    },
    logoutFromAllDevice: {
      badRequest: ["User id can not be empty"],
      notFound: ["User not found"],
    },
    logoutFromOneDevice: {
      badRequest: ["User id can not be empty", "Device id can not be empty"],
      notFound: ["User not found", "Device not found"],
    },
  },
  user: {
    deleteUser: {
      badRequest: ["Unauthorized to delete user", "Unauthorized action"],
      notFound: ["User not found"],
    },
    updateBio: {
      badRequest: [
        "Update user id can not be empty",
        "Cannot update user without data",
        "Unauthorized to update user",
      ],
      notFound: ["User not found"],
    },
    updateUsername: {
      badRequest: [
        "Update user id can not be empty",
        "Cannot update user without data",
        "Unauthorized to update user",
        "You can only change your username every 60 days. Try again in X days",
      ],
      notFound: ["User not found"],
    },
    updateProfilePicture: {
      badRequest: ["Data from client can not be empty", "Unauthorized"],
      notFound: ["User not found"],
    },
    getUser: {
      badRequest: ["User id can not be empty"],
      notFound: ["User not found"],
    },
    toggleActivate: {
      badRequest: ["User id can not be empty"],
      notFound: ["User not found"],
    },
    assignRoleToUser: {
      badRequest: ["User Id can not be empty"],
      notFound: ["User not found", "Role not found"],
    },
    assignPermissionToRole: {
      badRequest: ["Role id can not be empty"],
      notFound: ["Role not found", "Permission not found"],
    },
    getUserRole: {
      badRequest: ["User id can not be empty"],
      notFound: ["User not found"],
    },
    getUserPermission: {
      badRequest: ["User id can not be empty"],
      notFound: ["User not found"],
    },
  },
  category: {
    getCategoryById: {
      badRequest: ["Id can not be empty"],
      notFound: ["Category not found"],
    },
    getCategoryBySlug: {
      badRequest: ["Slug can not be empty"],
      notFound: ["Category not found"],
    },
    getCategoriesByTag: {
      badRequest: ["Data from client can not be empty"],
      notFound: ["Tag not found"],
    },
    createCategory: {
      badRequest: ["Category name can not be empty", "Image can not be empty"],
    },
    deleteCategory: {
      badRequest: ["Id can not be empty"],
      notFound: ["Category not found"],
    },
    updateCategory: {
      badRequest: ["Id can not be empty"],
      notFound: ["Category not found"],
    },
  },
  tag: {
    createTag: {
      badRequest: ["Tag name can not be empty"],
    },
    deleteTag: {
      badRequest: ["Tag id can not be empty"],
      notFound: ["Tag not found"],
    },
    updateTag: {
      badRequest: ["Tag id can not be empty"],
      notFound: ["Tag not found"],
    },
    assignTagsToCategory: {
      badRequest: ["Category id can not be empty"],
      notFound: ["Category not found", "Tag with id: <tag_id> not found"],
    },
  },
  followers: {
    follow: {
      badRequest: [
        "User id can not be empty",
        "User to follow's id can not be empty",
      ],
      notFound: ["Follower not found", "User to follow not found"],
    },
    unfollow: {
      badRequest: [
        "User id can not be empty",
        "User to follow's id can not be empty",
      ],
      notFound: ["Follower not found", "User to follow not found"],
    },
    getListFollowers: {
      badRequest: ["User id can not be empty"],
      notFound: ["Follower not found", "User not found"],
    },
    getListFollowings: {
      badRequest: ["User id can not be empty"],
      notFound: ["Follower not found", "User not found"],
    },
  },
  friends: {
    sendFriendRequest: {
      badRequest: [
        "Sender id can not be empty",
        "Receiver id can not be empty",
        "You can not send friend request to yourself",
        "Already friend",
        "Cannot send request",
      ],
      notFound: ["Sender not found", "Receiver not found"],
    },
    removeFriend: {
      badRequest: [
        "User id can not be empty",
        "Friend id can not be empty",
        "You are not friend with this person",
      ],
      notFound: ["User not found", "Friend not found"],
    },
    rejectFriendRequest: {
      badRequest: [
        "Sender id can not be empty",
        "Receiver id can not be empty",
        "Already friend",
      ],
      notFound: [
        "Sender not found",
        "Receiver not found",
        "Friend request not found",
      ],
    },
    acceptFriendRequest: {
      badRequest: [
        "Sender id can not be empty",
        "Receiver id can not be empty",
        "Already friend",
      ],
      notFound: [
        "Sender not found",
        "Receiver not found",
        "Friend request not found",
      ],
    },
    getListFriend: {
      badRequest: [
        "User to get friend's list's id can not be empty",
        "Current user id from client can not be empty",
      ],
      notFound: ["User not found", "Current user not found"],
    },
    getListFriendRequest: {
      badRequest: ["Receiver Id can not be empty"],
      notFound: ["Receiver not found"],
    },
    getMutualFriends: {
      badRequest: [
        "User to get mutual friends' id can not be empty",
        "Current user id can not be empty",
      ],
      notFound: ["User not found", "currentUser not found"],
    },
  },
}
