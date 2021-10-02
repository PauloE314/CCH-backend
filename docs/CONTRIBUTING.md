# Contribution guide

To be able to contribute with the project, please follow the [installation guide]() before.

## Project structure

This project aims to apply some the software development good practices, like layered structure and SOLID principals. In general, it'll follow the MVC architectural pattern, but, to avoid the typical 'fat controller', it won't be restricted to only 3 types of files. The socket listeners and emitters will be written in a an analogous form to the common request controllers.

### Folder structure

- `src`

  - `@types` (typescript definitions and shared interfaces)
  - `app` (contains the application itself and related files, like setup ones or error handlers)
  - `config` (configuration files)
  - `controllers` (http request handlers)
  - `db` (database specific files)
  - `models` (stores the domain objects)
  - `services` (specific domain operations)
  - `socket` (websocket listeners and emitters)

- `test`
- `docs`
- `.github`

## Tests

Every feature needs to be correctly tested in the most of the possible scenarios. It's recommended to write the tests before the actual implementation. It's important that every PR, related to bug fixes or features implementations, implement tests that wouldn't pass before, but that, after the change, they do.

The test format needs to follow a nice and readable structure. The following one is the recommended:

```js
describe('UserController', () => {
  describe('POST "/users/"', () => {
    describe('when missing username', () => {
      it('returns a 404 status response', () => {
        // ....
      });
      it('returns a nice error message', () => {
        // ....
      });
    });
  });
});
```

This test structure is spired by the RSpec way (specially by the [better RSpec guide](https://www.betterspecs.org/)).
