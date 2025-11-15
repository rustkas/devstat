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
```

Generated from `openapi.yaml` with OpenAPI Generator.