# Leef

Lightweight, type-safe HTTP client based on `window.fetch`, with an axios-like API.

```js
import leef from "leef-js";

const res = await leef.get("https://api.github.com/users/frankdilo");
const userInfo = res.data; // decoded json
```

## Methods

```js
leef.get(url, config);
leef.delete(url, config);
leef.head(url, config);
leef.options(url, config);
leef.post(url, data, config);
leef.put(url, data, config);
leef.patch(url, data, config);
```

## Build and instance

```js
import leef from "leef-js";

const api = leef.instance({
  baseURL: "https://api.example.com"
  headers: {
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
  },
});


await api.get("/users");
```
