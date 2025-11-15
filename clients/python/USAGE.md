# DevState Python Client Usage

Install (from PyPI after publish):

```sh
pip install devstate-client
```

Example:

```python
import requests

BASE = 'http://localhost:3180'

def verify(limit=0):
    return requests.get(f'{BASE}/v1/devstate/verify', params={'limit': limit}).json()

def update_state(patch, token=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    return requests.post(f'{BASE}/v1/devstate/state', json=patch, headers=headers).json()

print(verify(0))

# Rotate key (Bearer auth)
def rotate_key(kid, secret, token):
    headers = {'Authorization': f'Bearer {token}'}
    return requests.post(f'{BASE}/v1/devstate/keys/rotate', json={'id': kid, 'secret': secret}, headers=headers).json()

# Archive history older than N days
def archive(days, token):
    headers = {'Authorization': f'Bearer {token}'}
    return requests.post(f'{BASE}/v1/devstate/history/archive', json={'days': days}, headers=headers).json()

# Search history
def search(actor=None, action=None, since=None, until=None, limit=100):
    params = {}
    if actor: params['actor'] = actor
    if action: params['action'] = action
    if since: params['since'] = since
    if until: params['until'] = until
    params['limit'] = limit
    return requests.get(f'{BASE}/v1/devstate/history/search', params=params).json()
```

Generated from `openapi.yaml` with OpenAPI Generator.