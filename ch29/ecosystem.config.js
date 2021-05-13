module.exports = {
  apps: [{
    name: 'social_crawler',
    node_args : '-r dotenv/config',
    script: "node tools/schedule.js",    
    cwd: __dirname,
    exec_mode: 'fork',
    watch: true,
    time: true,
    ignore_watch: ["node_modules"],
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    max_restarts: 2
  }]
};
