export const Bull = {
  flow: {
    image: "image",
  },
  queue: {
    image: {
      optimize: "image-optimize",
      upload: "image-upload",
      upload_multiple: "multiple-image-upload",
      remove: "image-remove",
    },
    post: {
      schedule: "schedule-post",
    },
    user_post: {
      schedule: "schedule-user-post",
      cache_post: "cache-user-post",
      post_view: "post_view",
    },
  },
  job: {
    image: {
      optimize: "image-job-optimize",
      upload: "image-job-upload",
      upload_multiple: "multiple-image-job-upload",
      remove: "image-job-remove",
    },
    post: {
      schedule: "schedule-job-post",
    },
    user_post: {
      schedule: "schedule-job-user-post",
      cache_post: "cache-job-user-post",
      post_view: "post_job_view",
    },
  },
}
