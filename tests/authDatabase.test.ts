import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Auth & Database: data/users.json is Valid JSON and Contains Seeded Users', () => {
  const usersPath = path.resolve(process.cwd(), 'data', 'users.json');
  assert.ok(fs.existsSync(usersPath), 'data/users.json must exist on disk');

  const content = fs.readFileSync(usersPath, 'utf-8');
  const users = JSON.parse(content);

  assert.ok(Array.isArray(users), 'Stored users must be an array');
  assert.ok(users.length >= 3, 'Must have at least 3 seeded users in database');

  // Verify Thanmayi P exists
  const thanmayi = users.find((u: any) => u.email === 'p.thanmayi09@gmail.com');
  assert.ok(thanmayi, 'Owner user Thanmayi P must be recorded in database');
  assert.strictEqual(thanmayi.role, 'Executive Admin');
  assert.ok(thanmayi.loginCount >= 1, 'Login count must be tracked');
  assert.ok(thanmayi.lastLoginAt, 'lastLoginAt must be timestamped');
});

test('Auth & Database: User Schema Conforms to Domain Requirements', () => {
  const usersPath = path.resolve(process.cwd(), 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  for (const user of users) {
    assert.ok(user.id, 'User must have a persistent ID');
    assert.ok(user.name, 'User must have a name');
    assert.ok(user.email, 'User must have a valid email');
    assert.ok(user.role, 'User must have an assigned role');
    assert.ok(['google', 'email'].includes(user.provider), 'Provider must be google or email');
    assert.ok(typeof user.loginCount === 'number', 'Login count must be a number');
  }
});
