# 🍃 Leef

![CI](https://github.com/frankdilo/leef-js/workflows/CI/badge.svg)
![NPM version](https://badgen.net/npm/v/leef-js)
![Bundle size (minified + g-zipped)](https://badgen.net/bundlephobia/minzip/leef-js)

> ⚠️ This is currently a work-in-progress. I am learning TypeScript as I go!

Lightweight, type-safe HTTP client based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), with an API similar to [axios](https://github.com/axios/axios).

## Installation

```sh
npm install leef-js
yarn add leef-js
```

## Basic Usage

```js
import leef from "leef-js";

const res = await leef.get("https://api.github.com/users/frankdilo");

console.log(res.data.login); // => "frankdilo"
console.log(res.status); // => 200
```

## Methods

```js
leef.get(url, options);
leef.post(url, data, options);
leef.put(url, data, options);
leef.patch(url, data, options);
leef.delete(url, options);
leef.head(url, options);
leef.options(url, options);
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

## Options

- `baseURL`
- `headers`
- `timeout`
- `bodySerializer`
- `defaultContentType`
