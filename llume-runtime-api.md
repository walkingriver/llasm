# llume.js Terse API (exposed as global l or import {l})

l.m(manifest) // mount / hydrate
l.u(patch) // update state (Proxy)
l.f(name, payload) // fetch (auto CBOR, CORS, retry, validation)
l.v(schema, data) // validate
l.r(locale) // switch i18n
l.q(sel) // query (short CSS selector)
l.s() // serialize state for handoff

Event handlers: 2-letter functions (f1, f2…) defined in the tiny script block.
All logic inside handlers must stay < 500 bytes minified.
