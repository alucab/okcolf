/// <reference path="../pb_data/types.d.ts" />
// server/pocketbase/pb_migrations/001_initial_setup.js
// Migration: Create rate_limits collection for OTP anti-abuse protection

migrate((app) => {
  const collection = new Collection({
    name: "rate_limits",
    type: "base",
    fields: [
      {
        name: "email",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 255,
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        }
      },
      {
        name: "ip",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 45,
          pattern: ""
        }
      },
      {
        name: "attempts",
        type: "number",
        required: true,
        presentable: false,
        options: {
          min: 1,
          max: null,
          noDecimal: true
        }
      },
      {
        name: "last_attempt",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "user_agent",
        type: "text",
        required: false,
        presentable: false,
        options: {
          min: null,
          max: 500,
          pattern: ""
        }
      }
    ],
    indexes: [],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null
  });

  return app.save(collection);

}, (app) => {
  const collection = app.findCollectionByNameOrId("rate_limits");
  return app.delete(collection);
});