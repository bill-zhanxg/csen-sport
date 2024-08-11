# Changelog

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
