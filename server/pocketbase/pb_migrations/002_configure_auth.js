/// <reference path="../pb_data/types.d.ts" />
// server/pocketbase/pb_migrations/002_configure_auth.js
// Migration: Configure users collection for OTP-only authentication

migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Add 'name' field to users collection (for welcome.html form)
  collection.fields.addAt(3, new Field({
    name: "name",
    type: "text",
    required: false,
    presentable: false,
    options: {
      min: null,
      max: 255,
      pattern: ""
    }
  }));

  // Configure auth options for OTP-only authentication
  collection.options = {
    allowUsernameAuth: false,  // Disable username/password
    allowEmailAuth: true,      // Enable email auth
    requireEmail: true,        // Email is mandatory
    exceptEmailDomains: [],
    onlyEmailDomains: [],
    onlyVerified: true,        // Require OTP verification
    minPasswordLength: 0,      // No password needed
    allowOAuth2Auth: false,
    manageRule: null
  };

  // Set access rules
  collection.listRule = null;
  collection.viewRule = "id = @request.auth.id";
  collection.createRule = "";
  collection.updateRule = "id = @request.auth.id";
  collection.deleteRule = null;

  return app.save(collection);

}, (app) => {
  // Rollback: restore default auth settings and remove name field
  const collection = app.findCollectionByNameOrId("users");

  // Remove name field
  collection.fields.removeById(collection.fields.getByName("name").id);

  // Restore default options
  collection.options = {
    allowUsernameAuth: true,
    allowEmailAuth: true,
    requireEmail: false,
    exceptEmailDomains: [],
    onlyEmailDomains: [],
    onlyVerified: false,
    minPasswordLength: 8,
    allowOAuth2Auth: false,
    manageRule: null
  };

  collection.listRule = null;
  collection.viewRule = "id = @request.auth.id";
  collection.createRule = "";
  collection.updateRule = "id = @request.auth.id";
  collection.deleteRule = null;

  return app.save(collection);
});