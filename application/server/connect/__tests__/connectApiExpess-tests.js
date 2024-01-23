const mocked = require('./mock');
import express from "express";

const baseUrl = 'http://127.0.0.1:8080/';
const app = express();

describe('Test Connect Routes', () => {
  test('Test Default route', async () => {
    const res = await get(baseUrl);
    mocked.get.;
    expect(res).toBeTruthy();
    expect(res.status).toBe(200);
    expect(res.data).toContain('<!DOCTYPE html>');
    expect(res.data).toContain('Web site created using create-react-app');
  });
});