/// <reference path="../pb_data/types.d.ts" />
// pb_hooks/cors.pb.js


// 3️⃣ OPTIONS handler first
/*routerAdd('OPTIONS', '/*', (e) => {
  const ALLOWED_ORIGINS = [
  'https://okcolf.it',
  'https://alucab.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8090',
  'http://127.0.0.1:8090',
];

  const origin =
    e.request.headers?.get('Origin') ||
    e.request.header?.get('Origin') || '';

  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin?.startsWith('http://localhost') ||
    origin?.startsWith('http://127.0.0.1');

  console.log('🟢 OPTIONS from:', origin, 'allowed?', isAllowed);

  if (isAllowed) {
    e.response.header.set('Access-Control-Allow-Origin', origin);
    e.response.header.set('Access-Control-Allow-Credentials', 'true');
  } else {
    e.response.header.set('Access-Control-Allow-Origin', '*');
  }

  e.response.header.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  e.response.header.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  e.response.header.set('Access-Control-Max-Age', '86400');

  return e.noContent(204);
}); */

// 4️⃣ Global middleware
routerUse(new Middleware((e) => {
  const ALLOWED_ORIGINS = [
  'https://okcolf.it',
  'https://alucab.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8090',
  'http://127.0.0.1:8090',
];
  const origin =
    e.request.headers?.get('Origin') ||
    e.request.header?.get('Origin') || '';

  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin?.startsWith('http://localhost') ||
    origin?.startsWith('http://127.0.0.1');

  console.log('🌍 Origin:', origin, 'allowed?', isAllowed);
  console.log('Response headers type:', typeof e.response.headers, 'single header field?', !!e.response.header);
  e.response.header().set("Some-Header", "123")



  e.response.header.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  e.response.header.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  e.response.header.set('Access-Control-Max-Age', '86400');

  console.log('Response headers type:', typeof e.response.headers, 'single header field?', !!e.response.header);

  return e.next();
}, -1042))
