module.exports = {
  apps: [
    {
      name: "netflix-remote-broker",
      script: "src/index.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: "",
      instances: 1,
      autorestart: true,
      watch: false,
      ignore_watch: ["node_modules"],
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        REDIS_HOST: "localhost",
        REDIS_PORT: 6379
      },
      env_production: {
        NODE_ENV: "production",
        REDIS_HOST: "localhost",
        REDIS_PORT: 6379
      }
    }
  ],

  deploy: {
    production: {
      key: "/Users/nguyentung/.ssh/id_rsa",
      user: "deploy",
      host: ["45.77.40.46"],
      ref: "origin/master",
      repo: "git@github.com:tungnt620/netflix-remote-folk.git",
      path: "/var/www/netflix-remote",
      "post-deploy":
        "cd broker && npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
