import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

const request = supertest(app);

// runs once before all tests
beforeAll(async () => {
  // clean up test users before running
  await pool.query(`DELETE FROM users WHERE email LIKE '%test.com'`);
},10000);

// runs once after all tests
afterAll(async () => {
  await pool.query(`DELETE FROM users WHERE email LIKE '%test.com'`);
  // removed pool.end() — forceExit handles cleanup
}, 15000);

describe('POST /api/auth/register', () => {

  it('registers a new user successfully', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        name: 'Jest User',
        email: 'jest@test.com',
        password: 'Password1!',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('jest@test.com');
    expect(res.body.data.user.password).toBeUndefined(); // never exposed
  });

  it('returns 409 when email already exists', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        name: 'Jest User',
        email: 'jest@test.com',  // same email as above
        password: 'Password1!',
      });

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Email already in use');
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 when password is weak', async () => {
    const res = await request
      .post('/api/auth/register')
      .send({
        name: 'Jest User',
        email: 'jest2@test.com',
        password: 'weak',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === 'password')).toBe(true);
  });

});

describe('POST /api/auth/login', () => {

  it('logs in with correct credentials', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'jest@test.com',
        password: 'Password1!',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('returns 401 with wrong password', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'jest@test.com',
        password: 'WrongPassword1!',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('returns 401 with wrong email', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'ghost@test.com',
        password: 'Password1!',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password'); // same message — security
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

});