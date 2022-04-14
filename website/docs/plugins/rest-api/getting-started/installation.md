---
id: installation
title: Installing the API plugin
---

Add **@eloqjs/api** dependency to your project:

```bash npm2yarn
npm install @eloqjs/api
```

:::caution

If you are using the `dev` version of `@eloqjs/api`, you should fix your `package.json` to the exact version that you
develop with to avoid updating with breaking changes since package is auto published.

:::

### Nuxt

Create a plugin **~/plugins/eloqjs.js**

```js title="~/plugins/eloqjs.js"
import axios from 'axios'

import ELOQJS from '@eloqjs/core'
import ELOQJSAPI, { AxiosHttpClient } from '@eloqjs/api'

ELOQJS.use(ELOQJSAPI, { httpClient: new AxiosHttpClient(axios) })
```

And register it on **nuxt.config.js**

```js title="nuxt.config.js"
export default {
  plugins: [
    '~/plugins/eloqjs'
  ],
}
```

### Vue

Set up on **src/main.js**

```js title="src/main.js"
import axios from 'axios'

import ELOQJS from '@eloqjs/core'
import ELOQJSAPI, { AxiosHttpClient } from '@eloqjs/api'

ELOQJS.use(ELOQJSAPI, { httpClient: new AxiosHttpClient(axios) })
```
