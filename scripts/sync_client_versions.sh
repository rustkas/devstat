#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/sync_client_versions.sh <client-ts-tag> <client-py-tag>
# Example: ./scripts/sync_client_versions.sh client-ts-v0.2.0 client-py-v0.2.0

TS_TAG=${1:-}
PY_TAG=${2:-}

if [[ -z "$TS_TAG" || -z "$PY_TAG" ]]; then
  echo "Usage: $0 client-ts-vX.Y.Z client-py-vX.Y.Z" >&2
  exit 1
fi

TS_VER=${TS_TAG#client-ts-v}
PY_VER=${PY_TAG#client-py-v}

echo "Sync TS version to $TS_VER"
jq ".version=\"$TS_VER\"" clients/typescript/package.json > clients/typescript/package.json.tmp && mv clients/typescript/package.json.tmp clients/typescript/package.json

echo "Sync Py version to $PY_VER"
python - <<PY
import re
from pathlib import Path
p=Path('clients/python/pyproject.toml')
t=p.read_text()
t=re.sub(r'version\s*=\s*"[0-9.]+"',f'version = "{PY_VER}"',t)
p.write_text(t)
PY

git add clients/typescript/package.json clients/python/pyproject.toml
git commit -m "chore(sync): align client versions to tags $TS_TAG, $PY_TAG" || true