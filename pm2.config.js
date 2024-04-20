module.exports = {
  apps: [
    {
      name: "remix",
      script: "npm",
      args: "start",
      autorestart: true,
      watch: false,
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
        SESSION_SECRET: process.env.SESSION_SECRET,
        GIT_REVISION: process.env.GIT_REVISION,
      },
    },
  ],
};
