# DevState Go Client

Generate with OpenAPI Generator:

```
openapi-generator-cli generate -i ../../openapi.yaml -g go -o . --additional-properties=packageName=devstate
```

QuickStart:

```go
package main

import (
  "context"
  "fmt"
  devstate "github.com/rustkas/devstate/clients/go"
)

func main() {
  cfg := devstate.NewConfiguration()
  cfg.Servers = devstate.ServerConfigurations{{URL: "http://localhost:3180"}}
  api := devstate.NewAPIClient(cfg)

  // Verify
  v, _, _ := api.DefaultAPI.V1DevstateVerifyGet(context.Background()).Execute()
  fmt.Println(v)

  // Rotate key (Bearer)
  ctx := context.WithValue(context.Background(), devstate.ContextAPIKeys, map[string]devstate.APIKey{
    "bearerAuth": {Key: "Bearer " + "<token>"},
  })
  api.DefaultAPI.V1DevstateKeysRotatePost(ctx).Id("key-2025-11").Secret("replace").Execute()

  // Archive older than 30 days
  api.DefaultAPI.V1DevstateHistoryArchivePost(ctx).Days(30).Execute()

  // Search
  res, _, _ := api.DefaultAPI.V1DevstateHistorySearchGet(context.Background()).Actor("k6").Action("append_test").Limit(50).Execute()
  fmt.Println(res.Items)
}
```