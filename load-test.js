import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '5m',
};

const BASE_URL = 'http://3.95.131.242';

export default function () {

  // Login
  const loginPayload = JSON.stringify({
    username: 'admin',
    password: 'admin'
  });

  const loginRes = http.post(
    `${BASE_URL}/login`,
    loginPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(loginRes, {
    'Login Successful': (r) => r.status === 200,
  });

  // Extract JWT
  const token = loginRes.json('accessToken');

  // Get Todos
  const todoRes = http.get(
    `${BASE_URL}/todos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  check(todoRes, {
    'Todos Retrieved': (r) => r.status === 200,
  });

  sleep(1);
}
