const { execSync } = require('child_process');
try {
  const result = execSync('npx vite build', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('SUCCESS:', result);
} catch (e) {
  console.log('STDOUT:', e.stdout);
  console.log('STDERR:', e.stderr);
}
