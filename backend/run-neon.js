const cp = require('child_process');
const payload = { step: "getting-started" };
const child = cp.spawnSync('npx.cmd', [
  '-y', 'neon', 'init', '--agent', '--data', JSON.stringify(payload)
], { stdio: 'inherit' });
process.exit(child.status);
