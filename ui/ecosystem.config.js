module.exports = {
  apps: [
    {
      name: 'netflix-remote-fe',
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
      user: 'deploy',
      host: ['45.77.40.46'],
      ref: 'origin/master',
      repo: 'git@github.com:tungnt620/netflix-remote-folk.git',
      path: '/var/www/netflix-remote',
      'post-deploy': 'cd ui && npm install && npm run build',
    },
  },
}
