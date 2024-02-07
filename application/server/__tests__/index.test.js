import { get } from 'axios';

const baseUrl = 'http://127.0.0.1:8080/';

describe('Test Routes', () => {
  test('Test Default route', async () => {
    const res = await get(baseUrl);

    expect(res).toBeTruthy();
    expect(res.status).toBe(200);
    expect(res.data).toContain('<!DOCTYPE html>');
    expect(res.data).toContain('Web site created using create-react-app');
  });

  test('Test PING route', async () => {
    const res = await get(`${baseUrl}ping`);

    expect(res).toBeTruthy();
    expect(res.status).toBe(200);
    expect(res.data).toEqual('ok');
  });
});