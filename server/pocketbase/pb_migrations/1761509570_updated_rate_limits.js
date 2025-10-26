/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_80030372")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX idx_rate_limits_email ON rate_limits (email)",
      "CREATE INDEX idx_rate_limits_ip ON rate_limits (ip)",
      "CREATE INDEX `idx_rate_limits_last_attempt` ON `rate_limits` (\n  `last_attempt`\n)",
      "CREATE INDEX idx_rate_limits_email_ip ON rate_limits (email, ip)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_80030372")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
