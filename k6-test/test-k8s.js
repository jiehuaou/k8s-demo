import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 10,
    duration: '10s',
};

export default function () {
    const res = http.get('http://hello-ab-svc:3000/api/hello/error/500/a1');
    check(res, {
        'status is 200': () => res.status === 200,
      });
    sleep(1);

}