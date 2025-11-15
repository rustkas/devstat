# DevState Operations Playbook

## Incidents
- verify_failed: check database initialization, HMAC_SECRET and active key, run `GET /v1/devstate/verify?limit=0`.
- export_failed: ensure `.trae/` exists and server has write permissions.
- import_failed: validate `.trae/state.json` against `STATE.schema.json`, check HMAC chain in `history.json`.

## Routine
- Health: `GET /health` should be `status=ok`.
- Verify: `GET /v1/devstate/verify?limit=0` expected `{ ok: true }`.
- Locks cleanup: POST `/v1/devstate/locks/cleanup` or run scheduled job.

## Cron Recommendations
- Every 5 minutes: locks cleanup.
- Daily: export `.trae/state.json` and `.trae/history.json` to artifacts.

## Metrics & Alerts
- Alert when `devstate_hmac_verify_fail_total` increases.
- Alert when p95 latency of verify exceeds threshold.

## Access
- Mutating endpoints behind token/mTLS (optional) and rate limited.