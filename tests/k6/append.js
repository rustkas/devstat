import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/master/dist/bundle.js'

export const options = {
  scenarios: {
    append_rps: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 200,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '3m', target: 50 },
        { duration: '5m', target: 100 },
      ],
    },
  },
}

export default function () {
  const base = 'http://localhost:3180'
  const payload = {
    actor: 'k6',
    action: 'append_test',
    metadata: { rnd: Math.random().toString(36).slice(2) },
  }
  const headers = {}
  const token = __ENV.DEVSTATE_API_TOKEN
  if (token) headers['Authorization'] = `Bearer ${token}`
  const finalHeaders = Object.assign({ 'Content-Type': 'application/json' }, headers)
  const res = http.post(`${base}/v1/devstate/history`, JSON.stringify(payload), { headers: finalHeaders })
  const okAppend = check(res, { 'append 200': (r) => r.status === 200 })
  if (!okAppend) {
    console.error(`Append failed: status=${res.status} body=${res.body}`)
  }
  sleep(0.2)
}

export function handleSummary(data) {
  return {
    'append-summary.html': htmlReport(data),
    'append-summary.json': JSON.stringify(data, null, 2),
  }
}