import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = { vus: 5, duration: '15s' }

export default function () {
  const h = http.get('http://localhost:3180/health')
  check(h, { 'health 200': (r) => r.status === 200 })
  const v = http.get('http://localhost:3180/v1/devstate/verify?limit=0')
  check(v, { 'verify ok': (r) => r.status === 200 && (r.json().ok === true || r.json().error !== undefined) })
  sleep(0.2)
}