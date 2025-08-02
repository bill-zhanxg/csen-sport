# Changelog

## [0.10.2](https://github.com/bill-zhanxg/csen-sport/compare/v0.10.1...v0.10.2) (2025-08-02)


### Bug Fixes

* revert experimental change ([8d54f2d](https://github.com/bill-zhanxg/csen-sport/commit/8d54f2debf55fd44bc8de496277c80508627cdf1))
* update Node.js version to 22.x in Azure workflow ([0a00fef](https://github.com/bill-zhanxg/csen-sport/commit/0a00fef6e5a7d5087483dc111b521027c6820b65))

## [0.10.1](https://github.com/bill-zhanxg/csen-sport/compare/v0.10.0...v0.10.1) (2025-08-02)


### Bug Fixes

* fixed an issue in user setting where the form will revert to the previous value when submitted ([c78f0f6](https://github.com/bill-zhanxg/csen-sport/commit/c78f0f64d8080fe58795c81854ec44557b49ab54))
* turning off experimental features to see if it solves 500 ([4d87bc6](https://github.com/bill-zhanxg/csen-sport/commit/4d87bc630c1b4cb4d7c0bee7ee877fb19131adc2))

## [0.10.0](https://github.com/bill-zhanxg/csen-sport/compare/v0.9.3...v0.10.0) (2025-08-02)


### Features

* completely removed @preact/signals-react dependency from package.json and codebase ([4e27a70](https://github.com/bill-zhanxg/csen-sport/commit/4e27a7025cf1493cea0e251a316d8ebdbb34c578))
* enhance RoleForm and User page with improved styling and layout for better user experience ([04460ae](https://github.com/bill-zhanxg/csen-sport/commit/04460aeb15ceb8fc7e2afb77c18ecf8bf2cda038))
* implement RoleForm component for user role management and add loading state ([7acdfba](https://github.com/bill-zhanxg/csen-sport/commit/7acdfba2cc00c628e9ddfa7577a8c38cc89418f4))


### Bug Fixes

* remove cache from auth to see if that fix the 500 ([a686c8f](https://github.com/bill-zhanxg/csen-sport/commit/a686c8fc6a6428716c7e4bc1a71367ed6974fa6c))

## [0.9.3](https://github.com/bill-zhanxg/csen-sport/compare/v0.9.2...v0.9.3) (2025-08-02)


### Bug Fixes

* update test to correctly reference 'Casey Stadium' ([ab8e11c](https://github.com/bill-zhanxg/csen-sport/commit/ab8e11cddbd3746aed5a3606ca0ac1d86c4fba8c))

## [0.9.2](https://github.com/bill-zhanxg/csen-sport/compare/v0.9.1...v0.9.2) (2025-08-02)


### Bug Fixes

* update github action npm command to install dependencies with legacy peer dependencies ([91e5f20](https://github.com/bill-zhanxg/csen-sport/commit/91e5f20681084d0c19714cff0ff057ba03baea7a))

## [0.9.0](https://github.com/bill-zhanxg/csen-sport/compare/v0.8.0...v0.9.0) (2025-08-02)


### Features

* : migrate codebase to zod v4 ([ccf278a](https://github.com/bill-zhanxg/csen-sport/commit/ccf278a1b7480fde27a4de77122c51de258417bb))
* add onRequestError handler to Sentry server instrumentation ([297c8dd](https://github.com/bill-zhanxg/csen-sport/commit/297c8dd820c59bd5311213ee7913382e4f9281cf))
* **database:** xata make venues string instead of a table containing address and court number ([cd1c2bc](https://github.com/bill-zhanxg/csen-sport/commit/cd1c2bc19bb3becc692bc77f27b0f312fa6257f2))
* enhance Step1 component to support multiple sheet selection from Excel files ([3b50d39](https://github.com/bill-zhanxg/csen-sport/commit/3b50d394c75e55b95bd7bbc4d8d54b70c0d64058))
* fix some type error after removing venue table from database, need to continue ([6c58020](https://github.com/bill-zhanxg/csen-sport/commit/6c58020ee5340cb7868551616f4bd4ec7bff6790))
* remove step 2 - import venue pdf fully ([d3d4853](https://github.com/bill-zhanxg/csen-sport/commit/d3d485389622386f6749ed061377432ab3762586))
* removed all instance of venue table across the entire project, venue is now a string instead of an object ([2f0211f](https://github.com/bill-zhanxg/csen-sport/commit/2f0211f54e34d6498b5e4905dcb1732551d54f03))
* removed PDF import fixture functionality ([7b0c0bd](https://github.com/bill-zhanxg/csen-sport/commit/7b0c0bd30a17f409f264f8be8ff269af65fa7dd0))
* removed react-pdf as dependency ([7b0c0bd](https://github.com/bill-zhanxg/csen-sport/commit/7b0c0bd30a17f409f264f8be8ff269af65fa7dd0))
* removed ticket from navbar ([3a48bf1](https://github.com/bill-zhanxg/csen-sport/commit/3a48bf163210d78798eddfa690332841f384071e))
* removed venue upload from import page ([7b0c0bd](https://github.com/bill-zhanxg/csen-sport/commit/7b0c0bd30a17f409f264f8be8ff269af65fa7dd0))
* rewrite next.config.ts to include updated Sentry configuration and experimental features ([80a8cb1](https://github.com/bill-zhanxg/csen-sport/commit/80a8cb1b9c4699a1af46c9052b4222db24208c3b))
* update index documentation for Excel sheet processing in Step1 component ([751ac65](https://github.com/bill-zhanxg/csen-sport/commit/751ac65a1a67d09b9bac37bf83ce8a9eebe8c74b))
* **V2 Excel import:** finished client side new import fixture system, new algorithm, fixed all type errors ([3869631](https://github.com/bill-zhanxg/csen-sport/commit/3869631c73d19211f2581d994c761b49707cb7f7))


### Bug Fixes

* add client side file size validation for profile picture upload ([c021a72](https://github.com/bill-zhanxg/csen-sport/commit/c021a720443b138c060d2f8836ef418f1e0b1677))
* **compile error:** update href types to use __next_route_internal_types__.RouteImpl for better type safety ([6ca1738](https://github.com/bill-zhanxg/csen-sport/commit/6ca173859b9c87f25b29b9a71b57c2f9b0fd2fe1))
* **Danger:** remove venue reset functionality and related state management ([edb8499](https://github.com/bill-zhanxg/csen-sport/commit/edb8499f1f070069e3428b8fc857b5e25af816b1))
* fixed image upload size uncaught error increase size to 30mb ([80a8cb1](https://github.com/bill-zhanxg/csen-sport/commit/80a8cb1b9c4699a1af46c9052b4222db24208c3b))
* **import:** finalised and finished V2 import, both client and server and schemas ([4d03137](https://github.com/bill-zhanxg/csen-sport/commit/4d03137a4b96c3dcf40d247d685cdc53c2850ee8))
* **ImportPage:** simplify disable next step check and adjust button width ([ad46b5f](https://github.com/bill-zhanxg/csen-sport/commit/ad46b5fd0e22553759484afab09e58c4448fa3b6))
* Potential fix for code scanning alert no. 3: Workflow does not contain permissions ([dbff1f1](https://github.com/bill-zhanxg/csen-sport/commit/dbff1f19928d737fc67db389cfe4488dad116bb2))
* remove secrets read permission from Azure workflow ([08aab96](https://github.com/bill-zhanxg/csen-sport/commit/08aab96c0d1aeca85d5dfe853be64acebada7063))
* remove unused URL handling logic from Step1 and Step2 components ([b0dbf68](https://github.com/bill-zhanxg/csen-sport/commit/b0dbf68312d0ddec8513f98b3dce8b321d46612a))
* removed unused loading.tsx ([a10168d](https://github.com/bill-zhanxg/csen-sport/commit/a10168df926d8c35d6427951c2619e98ebdd05d3))
* **settings:** add missing words to cSpell configuration ([ffbdf2b](https://github.com/bill-zhanxg/csen-sport/commit/ffbdf2b3f85fda896db1d4d3a8ae6e100b59fe61))
* update UserAvatar component to use consistent shadow styling ([bed2225](https://github.com/bill-zhanxg/csen-sport/commit/bed22252d61b95ee7a6ae56f507348fa6189678e))
* update zod to v4 ([cfc998f](https://github.com/bill-zhanxg/csen-sport/commit/cfc998ffc930080e66f8a09a20339232dfc975f1))

## [0.8.0](https://github.com/bill-zhanxg/csen-sport/compare/v0.7.2...v0.8.0) (2025-05-08)


### Features

* renamed Sentry client configuration to nextjs instrumentation client ([6cf9a2f](https://github.com/bill-zhanxg/csen-sport/commit/6cf9a2f9fa08854c488ec0cdac6bd6d224e226aa))

## [0.7.2](https://github.com/bill-zhanxg/csen-sport/compare/v0.7.1...v0.7.2) (2025-05-08)


### Bug Fixes

* ensure session validation in getPaginatedMessages and return empty array if not authenticated ([d8d35b6](https://github.com/bill-zhanxg/csen-sport/commit/d8d35b61b141decefd58b1b21778c1940625d68f))

## [0.7.1](https://github.com/bill-zhanxg/csen-sport/compare/v0.7.0...v0.7.1) (2025-04-01)


### Bug Fixes

* update dependencies and remove sessionTimingIntegration from Sentry config ([22f36cd](https://github.com/bill-zhanxg/csen-sport/commit/22f36cdb7b4f888c3952d1ad8819c6441db114c9))

## [0.7.0](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.5...v0.7.0) (2025-02-07)


### Features

* add removeDupe script ([403bec7](https://github.com/bill-zhanxg/csen-sport/commit/403bec7e5e2702d4ea6f0f9479753bc7b1b1ed49))


### Bug Fixes

* replaced all useFormState with useActionState after react 19 upgrade ([f595e43](https://github.com/bill-zhanxg/csen-sport/commit/f595e43716b2019ceab2f98fba6294d69eef8696))

## [0.6.5](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.4...v0.6.5) (2025-02-02)


### Bug Fixes

* HOTFIX: fixed microsoft entra id issuer issue ([f82115c](https://github.com/bill-zhanxg/csen-sport/commit/f82115c8e1067a499ecb2e9859a7a91ff9da6651))

## [0.6.4](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.3...v0.6.4) (2025-02-02)


### Bug Fixes

* disable prefetch on Navbar items to prevent navigation issues ([a42204a](https://github.com/bill-zhanxg/csen-sport/commit/a42204a8b9372f782d9e8baf382f4cca9cfb7211))

## [0.6.3](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.2...v0.6.3) (2025-02-02)


### Bug Fixes

* disable prefetch on many links to prevent navigation issues ([96685d3](https://github.com/bill-zhanxg/csen-sport/commit/96685d3bac8e39a9294628321f1cadacaba1fb8b))

## [0.6.2](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.1...v0.6.2) (2025-02-01)


### Bug Fixes

* fixed get route params not awaited ([a6463a6](https://github.com/bill-zhanxg/csen-sport/commit/a6463a63bfb35767dee6c654fc5c056919fabd46))
* fixed type issue in navBar ([a6463a6](https://github.com/bill-zhanxg/csen-sport/commit/a6463a63bfb35767dee6c654fc5c056919fabd46))

## [0.6.1](https://github.com/bill-zhanxg/csen-sport/compare/v0.6.0...v0.6.1) (2025-02-01)


### Bug Fixes

* fixed changelog css build error ([2234119](https://github.com/bill-zhanxg/csen-sport/commit/2234119adb79396e653dbbaf4cf141c67b8edc26))
* fixed changelog css build error ([4452aa4](https://github.com/bill-zhanxg/csen-sport/commit/4452aa42301f4864d10d122c47065f2a5542c284))

## [0.6.0](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.18...v0.6.0) (2025-02-01)


### Features

* enable ppr and react complier ([87339a1](https://github.com/bill-zhanxg/csen-sport/commit/87339a1b039295405d860ac4a7668fb48507b095))
* make the UI look cleaner ([e971f95](https://github.com/bill-zhanxg/csen-sport/commit/e971f950cd4d0874e4933f759daa33bdb6a1e4c3))
* migrate to Nextjs 15 ([4d70ef3](https://github.com/bill-zhanxg/csen-sport/commit/4d70ef3fc78bd8eed4bbca9dbca224a0d1fc2fcd))
* migrate to Nextjs canary ([4d70ef3](https://github.com/bill-zhanxg/csen-sport/commit/4d70ef3fc78bd8eed4bbca9dbca224a0d1fc2fcd))
* update all searchParams to awaited ([a95b5cf](https://github.com/bill-zhanxg/csen-sport/commit/a95b5cf13b6fe39395ce6e148a47995829fdae27))
* update to daisyui v5 beta ([4d70ef3](https://github.com/bill-zhanxg/csen-sport/commit/4d70ef3fc78bd8eed4bbca9dbca224a0d1fc2fcd))
* update to tailwindcss v4 ([4d70ef3](https://github.com/bill-zhanxg/csen-sport/commit/4d70ef3fc78bd8eed4bbca9dbca224a0d1fc2fcd))


### Bug Fixes

* fix a few errors ([87339a1](https://github.com/bill-zhanxg/csen-sport/commit/87339a1b039295405d860ac4a7668fb48507b095))
* fix daisyui v5 beta visual changes ([e971f95](https://github.com/bill-zhanxg/csen-sport/commit/e971f950cd4d0874e4933f759daa33bdb6a1e4c3))
* removed tailwind config file ([87339a1](https://github.com/bill-zhanxg/csen-sport/commit/87339a1b039295405d860ac4a7668fb48507b095))
* update import code to support latest version of excel sheets ([7e2fba5](https://github.com/bill-zhanxg/csen-sport/commit/7e2fba5ec6bfb63efc99d2f499b9196195feff01))

## [0.5.18](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.17...v0.5.18) (2024-09-01)


### Bug Fixes

* (refactor): Update gamesToDates function to use user timezone for date formatting and change display date for weekly sport fixtures to date instead of using rawDate ([90c3cb7](https://github.com/bill-zhanxg/csen-sport/commit/90c3cb7bce465feffd7ef978a054bdfd3966df43))
* Add NProgress to logout form submission ([4532689](https://github.com/bill-zhanxg/csen-sport/commit/4532689e2299ffaba886896526c7ec1401f53062))
* improve padding for weekly sport fixture page and fix loading UI for ticket page on mobile ([e9bd4b1](https://github.com/bill-zhanxg/csen-sport/commit/e9bd4b18b3b148e11bfa807e96f034460c46ea62))

## [0.5.17](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.16...v0.5.17) (2024-08-31)


### Bug Fixes

* adding cache to auth function to avoid duplicate auth requests ([6e4e2d5](https://github.com/bill-zhanxg/csen-sport/commit/6e4e2d525b3b5f22f51022127e7b84e18eb85ce6))
* Fix missing parentheses in preventDefault call ([c25fa31](https://github.com/bill-zhanxg/csen-sport/commit/c25fa31af674420122b78752991b2109563cd90e))
* move global loading.tsx to each sub folder to prevent login route to load loading.tsx ([98fcc9d](https://github.com/bill-zhanxg/csen-sport/commit/98fcc9d92aece46fd853d3e6050c50fbbad4b2c2))
* update loading.tsx home page to include padding on all sides for better alignment ([71d9937](https://github.com/bill-zhanxg/csen-sport/commit/71d9937c9ba33dd4ae02d26415934412fa9bec7b))

## [0.5.16](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.15...v0.5.16) (2024-08-29)


### Bug Fixes

* add loading to weekly sport page for instant page navigation ([1d1303b](https://github.com/bill-zhanxg/csen-sport/commit/1d1303b4b78023feeaaf24df89525524bbf428db))
* adding skeletons to Navbar ([5fb172e](https://github.com/bill-zhanxg/csen-sport/commit/5fb172e5c428a8fd122479fe0d804f0efa0d9ed1))
* adding UI streaming to Navbar ([44d96d8](https://github.com/bill-zhanxg/csen-sport/commit/44d96d80b256e38c6c3bed66e06b83747c3d0627))
* auto changing timezone doesn't require a page refresh anymore ([b8353b6](https://github.com/bill-zhanxg/csen-sport/commit/b8353b655c4714427e0f4260ea943200b8a0b4da))
* fix home page loading skeleton shows everywhere and replaced it with a global loading box ([8d46af8](https://github.com/bill-zhanxg/csen-sport/commit/8d46af84405d56770d90bd9cf183ad23bb75f1db))
* improve before unload fix error ([155a8c4](https://github.com/bill-zhanxg/csen-sport/commit/155a8c4de3754258fbf21b545d035f008b25f806))
* improve prevent unload ([70e18f7](https://github.com/bill-zhanxg/csen-sport/commit/70e18f737b7e736fe839badd2874a2c901e9021e))
* test login route will only replace test user's document if the initial request is made one hour ago ([b8353b6](https://github.com/bill-zhanxg/csen-sport/commit/b8353b655c4714427e0f4260ea943200b8a0b4da))
* update NavBar component to use ticketUnread function instead of initUnread prop ([0c9fa76](https://github.com/bill-zhanxg/csen-sport/commit/0c9fa7695788e71a5eb52b5754623ec39e49456e))

## [0.5.15](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.14...v0.5.15) (2024-08-22)


### Bug Fixes

* test: trying to fix test login route not issuing the session cookie with correct name when connection is secure (https) ([5008186](https://github.com/bill-zhanxg/csen-sport/commit/50081862dc7f12a24c7d818470c368e1da49e176))

## [0.5.14](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.13...v0.5.14) (2024-08-21)


### Bug Fixes

* test login route not issuing the correct cookie with prefix secure ([1eb10cb](https://github.com/bill-zhanxg/csen-sport/commit/1eb10cb49080104a1d2bb70b4eca76d655355040))

## [0.5.13](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.12...v0.5.13) (2024-08-20)


### Bug Fixes

* a crucial bug preventing Safari (webkit) users from clicking the navigation menus (I found out because I implement testing, sorry for this long of a wait I know it's been a month. Also. I don't like Safari) ([1d81352](https://github.com/bill-zhanxg/csen-sport/commit/1d81352aef08f995c411c86928da8b0feea09bfa))
* remove react joyride (blue dot for guiding) until it's fixed ([5c32377](https://github.com/bill-zhanxg/csen-sport/commit/5c3237784518b2dd17a680bb97ecb6f763366889))

## [0.5.12](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.11...v0.5.12) (2024-08-17)


### Bug Fixes

* add loading to login btn to prevent layout shift ([c9c33a5](https://github.com/bill-zhanxg/csen-sport/commit/c9c33a58a5ed09d76251b56ff22eb30829e08d9a))
* add page title for each page ([af9d00a](https://github.com/bill-zhanxg/csen-sport/commit/af9d00a413de75429e4119194606787d63384212))
* add refresh at time to weekly sport timetable to avoid confusion ([3971578](https://github.com/bill-zhanxg/csen-sport/commit/3971578cfbdd063458b2ceaf0f2776eb4201c559))

## [0.5.11](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.10...v0.5.11) (2024-08-11)


### Bug Fixes

* Behind the scene work: adding testing to this project to avoid breaking website in production (this took a long time). ([023f918](https://github.com/bill-zhanxg/csen-sport/commit/023f9184f7afd834b7fa9bd314820f8ab1512013))
* Behind the scene work: improved Github Action workflows to make continuous integration (CI) simpler and faster ([023f918](https://github.com/bill-zhanxg/csen-sport/commit/023f9184f7afd834b7fa9bd314820f8ab1512013))

## [0.5.10](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.9...v0.5.10) (2024-08-06)


### Bug Fixes

* fixed needing to click navigation item twice to navigate on mobile and improved navbar performance ([0d027bb](https://github.com/bill-zhanxg/csen-sport/commit/0d027bba8d9fad1d6e16078ccd6b4d94030c8e9c))
* improve performance for weekly sport fixture page by implementing Parallel Data Fetching ([fcd0db0](https://github.com/bill-zhanxg/csen-sport/commit/fcd0db0babbe6686e20ce02999e730c1525789bd))

## [0.5.9](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.8...v0.5.9) (2024-08-05)


### Bug Fixes

* add more sentry integration and error filtering ([6bc5a2a](https://github.com/bill-zhanxg/csen-sport/commit/6bc5a2a73e222dd616d0ef30bf809b990245a783))
* fixed team and venue table overflow ([fc5b212](https://github.com/bill-zhanxg/csen-sport/commit/fc5b212930247f19775f38d297f3434c8fecf225))
* fixed WeeklySportEdit page's date was different (M/D/YYYY) than WeeklySportView (DD/MM/YYYY) ([164bfc5](https://github.com/bill-zhanxg/csen-sport/commit/164bfc5b09584c0ac87d6b91485cc601fb4a9086))
* improve user search and pagination page searchParams (url query) handling ([2d87b2b](https://github.com/bill-zhanxg/csen-sport/commit/2d87b2be14f148c0c524937b2301432195ebe5e7))
* mobile navbar overflow ([1a3a9a4](https://github.com/bill-zhanxg/csen-sport/commit/1a3a9a4cf994677e200e6b1d617190700fdc36f8))
* ReactJoyRideAction file name ([4c87f58](https://github.com/bill-zhanxg/csen-sport/commit/4c87f58a107ea69ed6b69ef373dc2332183c24b9))
* remove sessionTimingIntegration from the server because it was not supported ([2a97a66](https://github.com/bill-zhanxg/csen-sport/commit/2a97a6699aff109e862994e3a384aca20e8f8032))
* sentry disable blockAllMedia ([5ecf79c](https://github.com/bill-zhanxg/csen-sport/commit/5ecf79c70bb44c12ceecc41914045dd743def73e))

## [0.5.8](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.7...v0.5.8) (2024-08-04)


### Bug Fixes

* adding highlight to home button on desktop only ([deff44e](https://github.com/bill-zhanxg/csen-sport/commit/deff44e51286e41c919c3c1dade65a3d1ed4bd83))
* auto close profile dropdown when clicked again or when clicked item ([237970f](https://github.com/bill-zhanxg/csen-sport/commit/237970f0f2fb4735e8d1d5fb9bc1b66a6dd5cb23))
* fixed login 500 Internal Server Error by no server side rendering login component ([48af4c7](https://github.com/bill-zhanxg/csen-sport/commit/48af4c75bcbaafe2d3a440f5b5abbb8309d6424b))

## [0.5.7](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.6...v0.5.7) (2024-08-03)


### Bug Fixes

* improve desktop navigation by adding path highlight + animation, and auto close detail tag when clicked outside ([927ac49](https://github.com/bill-zhanxg/csen-sport/commit/927ac49f578fbe409c86f76667852c085a5a570c))
* improved mobile navigation by adding path highlight and overflow handling ([996c727](https://github.com/bill-zhanxg/csen-sport/commit/996c7277e948225b4f7be0c59f2052fe516337d0))
* mobile navigation jumps between tabs is fixed, click outside text area (within button) don't navigate is fixed. ([20fd481](https://github.com/bill-zhanxg/csen-sport/commit/20fd481d0f65b76eac8fcdb6d011205de373e487))
* prevent user from spam clicking the login button by adding loading button state ([31bd545](https://github.com/bill-zhanxg/csen-sport/commit/31bd54548cdec30273dfeb18907bc0f2ef418147))

## [0.5.6](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.5...v0.5.6) (2024-07-30)


### Bug Fixes

* prevent search params for weekly sport timetable page to have undefined values ([56fab76](https://github.com/bill-zhanxg/csen-sport/commit/56fab765f752ad0fa9e667bd7367ab82bbc4abbb))

## [0.5.5](https://github.com/bill-zhanxg/csen-sport/compare/v0.5.4...v0.5.5) (2024-07-28)


### Bug Fixes

* hydration error when going to weekly sport page should be fixed by no ssr dynamic importing ([fdfe624](https://github.com/bill-zhanxg/csen-sport/commit/fdfe62443be79046119fd68b0766234075547927))
* test commit for release please action ([e8fa05e](https://github.com/bill-zhanxg/csen-sport/commit/e8fa05e4ed1cbb57a89334a4d7de80a4d22ed6d3))
