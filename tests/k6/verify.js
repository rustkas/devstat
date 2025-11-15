import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/master/dist/bundle.js'

export const options = {
  scenarios: {
    ramping: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 5,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 15 },
        { duration: '10s', target: 0 },
      ],
    },
  },
}

export default function () {
  const h = http.get('http://localhost:3180/health')
  const okHealth = check(h, { 'health 200': (r) => r.status === 200 })
  if (!okHealth) {
    console.error(`Health check failed: status=${h.status} body=${h.body}`)
  }
  const v = http.get('http://localhost:3180/v1/devstate/verify?limit=0')
  const okVerify = check(v, { 'verify ok': (r) => r.status === 200 && (r.json().ok === true || r.json().error !== undefined) })
  if (!okVerify) {
    console.error(`Verify failed: status=${v.status} body=${v.body}`)
  }
  sleep(0.2)
}

export function handleSummary(data) {
  return {
    'verify-summary.html': htmlReport(data),
    'verify-summary.json': JSON.stringify(data, null, 2),
  }
}