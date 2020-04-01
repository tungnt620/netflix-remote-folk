module.exports = {
  apps: [
    {
      name: 'wuxia-world-audio-admin-fe',
      script: '',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      instances: '1',
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      key: '/Users/nguyentung/.ssh/id_rsa',
      user: 'root',
      host: ['155.138.240.103'],
      ref: 'origin/master',
      repo: 'git@github.com:tungnt620/wuxia-world-audio.git',
      path: '/var/www/wuxia-world-audio',
      'post-deploy': 'cd selfHost/admin-fe && npm install && npm run build',
    },
  },
}
