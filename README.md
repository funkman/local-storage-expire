local-storage-expire
====================

Bring expiration to local storage.

Goal is to be able to get the expiration features cookies can provide.

This only acts on localStorage. It doesnt look at sessionStorage or globalStorage.
If you want stuff to expire at close of browser, then ignore this library and use
sessionStorage.


This is loaded via require.

storage.getItem(key) => value (false if not exists, expired, or not supported)
storage.setItem(key, value, expiration) => value (false if not exists or not supported)
expiration can be a
- undefined - Expire in the lirbary default (5 years)
- number in ms. Expire in "expiration" ms
- Hash of number increments. Allowed keys:
-- years
-- days
-- hours
-- minutes
-- seconds

