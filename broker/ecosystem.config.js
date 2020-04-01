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
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ],

  deploy: {
    production: {
      key: "/Users/nguyentung/.ssh/id_rsa",
      user: "root",
      host: ["confession.vn"],
      ref: "origin/master",
      repo: "git@github.com:tungnt620/wuxia-world-audio.git",
      path: "/var/www/netflix-remote",
      "post-deploy":
        "cd selfHost/api && npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
