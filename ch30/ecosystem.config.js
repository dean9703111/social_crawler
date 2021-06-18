module.exports = {
  apps: [{
    name: 'social_crawler',
    node_args: '-r dotenv/config',
    script: "tools/schedule.js",
    cwd: __dirname,
    exec_mode: 'fork',
    watch: true,
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    ignore_watch: ["node_modules"],
    max_restarts: 2
  }]
};
