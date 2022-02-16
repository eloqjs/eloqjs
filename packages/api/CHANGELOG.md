# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.1-alpha.10](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.9...v0.0.1-alpha.10) (2022-02-16)


### Features

* **model:** improve model serialization ([e9dd334](https://github.com/eloqjs/eloqjs/commit/e9dd33424d2decd1d5ebcb116cc1987717b8f0bd))





## [0.0.1-alpha.9](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.8...v0.0.1-alpha.9) (2022-02-03)


### Bug Fixes

* **api:** check if `$id` is `undefined` ([f930df1](https://github.com/eloqjs/eloqjs/commit/f930df1761fe83acfabb2f87be56e9b567991736))





## [0.0.1-alpha.9](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.8...v0.0.1-alpha.9) (2022-02-03)


### Bug Fixes

* **api:** check if `$id` is `undefined` ([f930df1](https://github.com/eloqjs/eloqjs/commit/f930df1761fe83acfabb2f87be56e9b567991736))





## [0.0.1-alpha.8](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2021-11-26)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.7](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2021-11-16)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.6](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2021-11-10)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.5](https://github.com/eloqjs/eloqjs/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2021-11-05)

**Note:** Version bump only for package @eloqjs/api





## 0.0.1-alpha.4 (2021-10-30)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))





## [0.0.1-alpha.3](https://github.com/eloqjs/eloqjs/compare/@eloqjs/api@0.0.1-alpha.3...@eloqjs/api@0.0.1-alpha.3) (2021-10-29)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.3](https://github.com/eloqjs/eloqjs/compare/@eloqjs/api@0.0.1-alpha.2...@eloqjs/api@0.0.1-alpha.3) (2021-10-29)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.2](https://github.com/eloqjs/eloqjs/compare/@eloqjs/api@0.0.1-alpha.1...@eloqjs/api@0.0.1-alpha.2) (2021-10-29)

**Note:** Version bump only for package @eloqjs/api





## [0.0.1-alpha.1](https://github.com/eloqjs/eloqjs/compare/@eloqjs/api@0.0.1-alpha.0...@eloqjs/api@0.0.1-alpha.1) (2021-10-29)

**Note:** Version bump only for package @eloqjs/api





## 0.0.1-alpha.0 (2021-10-29)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))





## 0.0.1-alpha.0 (2021-10-29)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))





# 0.1.0-alpha.0 (2021-10-29)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))





# 0.1.0-alpha.0 (2021-10-29)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))





# 0.1.0-alpha.0 (2021-10-29)


### Bug Fixes

* **api-builder:** check if value is allowed in `params` ([7941414](https://github.com/eloqjs/eloqjs/commit/7941414dac94784085db99cad6b80aa86e4f4ea8))
* **api-builder:** fix type of `field` param of `select` ([3aea4c3](https://github.com/eloqjs/eloqjs/commit/3aea4c3a1b22fea0aac81d3d84e84700ddacd5cb))
* **api-builder:** make `query` readonly ([667b4f5](https://github.com/eloqjs/eloqjs/commit/667b4f5cd970fdc2b96aa78284fba301f52bda3a))
* **api-builder:** only add negative operator prefix if needed in `orderBy` ([68d105f](https://github.com/eloqjs/eloqjs/commit/68d105f6b279b4a51c327e259ec87c987f81389f))
* **api-httpclient:** export HttpClientOptions ([500a5eb](https://github.com/eloqjs/eloqjs/commit/500a5eb9c7b251a1f774e680b6c1ee8bd5c58ef1))
* **api-httpclient:** fix httpclient response type ([53e6292](https://github.com/eloqjs/eloqjs/commit/53e6292194db18aab433698a88222cc6d8394e6d))
* **api-operation:** add missing `beforeSave` hook on update ([2bff8aa](https://github.com/eloqjs/eloqjs/commit/2bff8aa925eb1edefe8c4e6152412db6db0f854e))
* **api-operation:** serialization `shouldPatch` based on model option ([9c04e76](https://github.com/eloqjs/eloqjs/commit/9c04e760631a056ff00da052d1988e07ed537435))
* **api-response:** save response should always return a model ([75f7cd9](https://github.com/eloqjs/eloqjs/commit/75f7cd9d7712721a7c2b5183f3a02be99d093fd5))
* **api-response:** singular response should not accept hooks anymore ([093fcc5](https://github.com/eloqjs/eloqjs/commit/093fcc53322c49bbcc99a11526f01677788c570f))
* **api:** disable `isPatch` option when syncing a related model ([e68dc87](https://github.com/eloqjs/eloqjs/commit/e68dc879a57dc4b026351aa1e2d2da86cff8f520))
* **api:** fix data of SingularResponse ([9970cf2](https://github.com/eloqjs/eloqjs/commit/9970cf2497938cf6a45d659ed1111b9d54bdee24))
* **api:** instantiate the record before serialize ([d8c26cd](https://github.com/eloqjs/eloqjs/commit/d8c26cd0de6be2a9940c0cfad99e7dfd39c79bfa))
* **api:** prefix private methods and properties with `_` ([4a64b39](https://github.com/eloqjs/eloqjs/commit/4a64b394aed953511914fbd4e0981a550273732c))
* **api:** remove duplicated model sync ([e0a1df8](https://github.com/eloqjs/eloqjs/commit/e0a1df8e6b6280f8e25dce706eca3a9272839ef2))
* **api:** should return on resolve promise to avoid continuing requests ([f6caa37](https://github.com/eloqjs/eloqjs/commit/f6caa37824c524f0490558672d28c073264b99ab))
* **api:** use `assert` to throw errors ([3a59850](https://github.com/eloqjs/eloqjs/commit/3a59850f6a4c8dc87cd178c71e2e64ae4b9e2a1e))


### Features

* **api-builder:** add `include` method ([67deab4](https://github.com/eloqjs/eloqjs/commit/67deab4aeac06cc289003add3cc9eb03844b7128))
* **api-builder:** add overloads to `params` ([37ec79c](https://github.com/eloqjs/eloqjs/commit/37ec79c2942b8a96b9db73bb9f0272f6faa192e8))
* **api-builder:** add query support to `orderBy` ([05531a8](https://github.com/eloqjs/eloqjs/commit/05531a80ae3b29f144221a03660f5b3cfe24443e))
* **api-builder:** add support to filter using query in `where` and `whereIn` ([557e7fc](https://github.com/eloqjs/eloqjs/commit/557e7fc23f067189fc0a489b0130af0bf449ea92))
* **api-builder:** add support to pass an object to `option` method ([8677317](https://github.com/eloqjs/eloqjs/commit/86773170fe6cb62c1b01e00208590b6cc75a3f02))
* **api-builder:** export `isUnallowedValue` ([083ef45](https://github.com/eloqjs/eloqjs/commit/083ef454d2ad6b1658b716c25c07e1af69359dd6))
* **api-builder:** improve `orderBy` to "force" direction when provided ([89b46c4](https://github.com/eloqjs/eloqjs/commit/89b46c49131191278d57997628f1f2d36c8f0690))
* **api-builder:** improve `params` to support nested object ([8180a07](https://github.com/eloqjs/eloqjs/commit/8180a077eafa211e0bad76ed7c7100f27eab2da0))
* **api-builder:** rename method `option` to `params` ([78e438e](https://github.com/eloqjs/eloqjs/commit/78e438e63b14a3048ff4037510e635e8382dfccb))
* **api-builder:** support selecting fields using an object ([b109abb](https://github.com/eloqjs/eloqjs/commit/b109abb03ed99009efa8dcc5b3e18c9ba2ee7bb5)), closes [#23](https://github.com/eloqjs/eloqjs/issues/23)
* **api-model:** improve delete method ([2a2b76d](https://github.com/eloqjs/eloqjs/commit/2a2b76d4b86ff5e63fef35e73cd468e6cb11f5a2))
* **api-model:** sync changes and references after create and update ([ab93e68](https://github.com/eloqjs/eloqjs/commit/ab93e68306167b64f0a0184a2288984391f321c4))
* **api-operation:** check for `saveUnchanged` option ([38a4d3a](https://github.com/eloqjs/eloqjs/commit/38a4d3a6155f343f3a4d4681fe34a203feb9d342))
* **api-operation:** request failure changes fatal state ([f3826ae](https://github.com/eloqjs/eloqjs/commit/f3826aea5d02e91a8f357ca816af2d0898fabc03))
* **api-operation:** skip request if some "before" hook return `false` ([649eccb](https://github.com/eloqjs/eloqjs/commit/649eccbed1d5ccb71c576a7dc5d07c3e904b8674))
* **api-operation:** use `$emit` instead of `executeMutationHooks` ([a95ebbe](https://github.com/eloqjs/eloqjs/commit/a95ebbe60a07390156fcca800a68946c9cc519d5))
* **api-operation:** use `patch` option in `update` method ([937295e](https://github.com/eloqjs/eloqjs/commit/937295e180e102f80476f66ea5dd25da4ebdbeaf))
* **api-response:** add `dataKey` and `dataTransformer` ([2a0a59a](https://github.com/eloqjs/eloqjs/commit/2a0a59aca48188b840b2464f570cd9b24cb2e3b8))
* **api-response:** always return a Response instance ([a959392](https://github.com/eloqjs/eloqjs/commit/a959392039ce215f0731fc50fe565b59cc12bdb6))
* **api-responses:** add SaveResponse ([1433bbf](https://github.com/eloqjs/eloqjs/commit/1433bbf6dcc2c16337966109241bb6859c0b084b))
* **api-response:** use `update` instead of `fill` to update model ([d402d2e](https://github.com/eloqjs/eloqjs/commit/d402d2ee49cc51422808ee34bfad147a1b263444))
* **api-support:** add core utils ([2f6debc](https://github.com/eloqjs/eloqjs/commit/2f6debc095e2b75e415985d8c70ad2a4e95c158d))
* **api-utils:** add `isPlainObject` util ([8f823aa](https://github.com/eloqjs/eloqjs/commit/8f823aaf93bdf950edc3c0d484e5db7733c1cd57))
* **api:** add `$query` method to Model class ([797e8e5](https://github.com/eloqjs/eloqjs/commit/797e8e5a30fa73d16966389cc1ecef237abf97be))
* **api:** add `attach`, `detach`, `sync` and `for` operations ([f916f1b](https://github.com/eloqjs/eloqjs/commit/f916f1be411e2ecbafcd33d528a2ef98f07f5381))
* **api:** add `config` method ([4dbb00c](https://github.com/eloqjs/eloqjs/commit/4dbb00cb5663a5fb8cae783e727c5c829f795908))
* **api:** add operation hooks ([7b6b3a1](https://github.com/eloqjs/eloqjs/commit/7b6b3a16bbc9c7c2e85aa37c773f52953480d5d7))
* **api:** add query builder methods to model class as static methods ([4266e77](https://github.com/eloqjs/eloqjs/commit/4266e770aab3dd293245564a33f17d81230262c4))
* **api:** add relations ([cb0a5c3](https://github.com/eloqjs/eloqjs/commit/cb0a5c3d4f9e74c5e9a943c99cd00cbf2a24ea87))
* **api:** add support to new field configuration ([9870701](https://github.com/eloqjs/eloqjs/commit/98707015c03ec988b6da7de8f030e8e04fc80426))
* **api:** allow passing a collection instance when fetching records ([ef2aeee](https://github.com/eloqjs/eloqjs/commit/ef2aeee5b051984b70c3d7c7f6303a7eeb5ee543))
* **api:** improve operation hooks ([e63da2d](https://github.com/eloqjs/eloqjs/commit/e63da2d8255e3321de1a1452122bf90d38f9a70e))
* **api:** improve request structure ([#16](https://github.com/eloqjs/eloqjs/issues/16)) ([4049e23](https://github.com/eloqjs/eloqjs/commit/4049e23cf990068a24c906b4bbe7e27c692d2ef6)), closes [#15](https://github.com/eloqjs/eloqjs/issues/15)
* **api:** throw an error when using api model without registering ([cf6e07c](https://github.com/eloqjs/eloqjs/commit/cf6e07c39e58859ef983e241b597e6819c1b14ba))
* **api:** throw error when performing operation for a non-registered relationship ([13dec3c](https://github.com/eloqjs/eloqjs/commit/13dec3c0e0136b9593f1efa22aaa191f8a25c118))
* **api:** use `defu` instead of `merge` ([eaa0e53](https://github.com/eloqjs/eloqjs/commit/eaa0e533a4eb44ac6b9cbc9bcdb8d3986366c09d))
* **api:** use SaveResponse for save operations ([4423b71](https://github.com/eloqjs/eloqjs/commit/4423b719eac1d578db26f3ac85f4fb876969e785))
* **api:** use utils ([a300d1c](https://github.com/eloqjs/eloqjs/commit/a300d1cd45467377d2e326deb12ee49b464b8e99))
* improve relations ([cee9285](https://github.com/eloqjs/eloqjs/commit/cee92856ca40d69a1d6c876e5e538aa77283ab6b))
* improve serialize to be a method of model instance ([051573a](https://github.com/eloqjs/eloqjs/commit/051573a9a525b250a0dc1d2d5b0362d0e0156db0))
* use Collection class instead of Collection data type ([42a4561](https://github.com/eloqjs/eloqjs/commit/42a4561f5fa804f67c85182bfd43d26aada5ae4d))
