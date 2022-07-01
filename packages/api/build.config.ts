import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true
  },
  entries: [
    'src/index',
    {
      input: 'src/httpclient/axios/index',
      name: 'httpclient/axios'
    }
  ]
})
