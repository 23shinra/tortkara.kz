module.exports = {
  apps: [
    {
      name: "tortkara.esl.kz",
      cwd: "/var/www/tortkara.esl.kz",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 35282",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "35282",
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
    },
  ],
};
