# firebase-orm🔥

[![NPM Version](https://img.shields.io/npm/v/firebase-orm.svg?style=flat)](https://www.npmjs.com/package/firebase-orm)
[![Build Status](https://travis-ci.com/deyvi-dev/firebase-orm.svg?token=KsyisFHzgCusk2sapuJe&branch=master)](https://travis-ci.com/deyvi-dev/firebase-orm)
[![Typescript lang](https://img.shields.io/badge/Language-Typescript-Blue.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/npm/l/firebase-orm.svg?style=flat)](https://www.npmjs.com/package/firebase-orm)

Firebase-ORM is a tiny wrapper on top of firebase-admin that makes life easier when dealing with Firestore collections. Firebase-ORM tries to ease the development of apps that rely on Firestore at the database layer by abstracting the access layer providing a familiar repository pattern. It basically helps us not worry about Firestore details and focus on what matters: adding cool new features!


> :warning: This is a maintained fork of the original Firebase-ORM project. New features and bug fixes will be added here.

## Usage

1.  Install the npm package:

```bash
yarn add firebase-orm reflect-metadata #or npm install firebase-orm reflect-metadata

# note: the reflect-metadata shim is required
```

2. [Initialize](https://firebase.google.com/docs/firestore/quickstart#initialize) your Firestore application:

```typescript
import * as admin from 'firebase-admin';
import * as firebaseOrm from 'firebase-orm';

const serviceAccount = require('../firestore.creds.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

const firestore = admin.firestore();
firebaseOrm.initialize(firestore);
```

3.  Create your Firestore models:

```typescript
import { Collection } from 'firebase-orm';

@Collection()
class Todo {
  id: string;
  text: string;
  done: Boolean;
}
```

4.  Do cool stuff with firebase-orm!

```typescript
import { Collection, getRepository } from 'firebase-orm';

@Collection()
class Todo {
  id: string;
  text: string;
  done: Boolean;
}

const todoRepository = getRepository(Todo);

const todo = new Todo();
todo.text = "Check firebase-orm's Github Repository";
todo.done = false;

const todoDocument = await todoRepository.create(todo); // Create todo
const mySuperTodoDocument = await todoRepository.findById(todoDocument.id); // Read todo
await todoRepository.update(mySuperTodoDocument); // Update todo
await todoRepository.delete(mySuperTodoDocument.id); // Delete todo
```

### Firebase Complex Data Types

Firestore has support for [complex data types](https://firebase.google.com/docs/firestore/manage-data/data-types) such as GeoPoint and Reference. Full handling of complex data types is [being handled in this issue](https://github.com/deyvi-dev/firebase-orm/issues/58). Temporarily, firebase-orm will export [Class Transformer's @Type](https://github.com/typestack/class-transformer#working-with-nested-objects) decorator. It receives a lamda where you return the type you want to cast to. [See GeoPoint Example](https://github.com/deyvi-dev/firebase-orm/blob/d8f79090b7006675f2cb5014bb5ca7a9dfbfa8c1/src/BaseFirestoreRepository.spec.ts#L471-L476).

#### Limitations

If you want to cast GeoPoints to your custom class, it must have `latitude: number` and `longitude: number` as public class fields. Hopefully this won't be a limitation in v1.

## Development

### Initial Setup

1.  Clone the project from github:

```bash
git clone git@github.com:deyvi-dev/firebase-orm.git
```

2.  Install the dependencies:

```bash
yarn # npm install
```

### Testing

Firebase-orm has two types of tests:

- Unit tests: `yarn test # or npm test`
- Integration tests: `yarn test:integration # or npm test:integration`

To be able to run the integration tests you need to [create a Firebase service account](https://firebase.google.com/docs/admin/setup#initialize_the_sdk) and declare some [environment variables](https://github.com/deyvi-dev/firebase-orm/blob/master/test/setup.ts#L5-L13).

Test files must follow the naming convention `*.test.ts` and use [jest](https://jestjs.io/) as the test runner.

### Committing

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) as the commit messages convention.

### Release a new version

This repo uses [Semantic Release](https://github.com/semantic-release/semantic-release) to automatically release new versions as soon as they land on master.

Commits must follow [Angular's Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

Supported commit types (taken from [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type)):

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation only changes
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor:** A code change that neither fixes a bug nor adds a feature
- **perf:** A code change that improves performance
- **test:** Adding missing or correcting existing tests
- **chore:** Changes to the build process or auxiliary tools and libraries such as documentation generation

<details>
  <summary>Manual Release</summary>
  If, by any reason, a manual release must be done, these are the instructions:

- To release a new version to npm, first we have to create a new tag:

```bash
npm version [ major | minor | patch ] -m "Relasing version"
git push --follow-tags
```

- Then we can publish the package to npm registry:

```bash
npm publish
```

- To deploy the documentation:

```bash
yarn deploy:doc # or npm deploy:doc
```

</details>

### Documentation

- Firebase-orm uses [typedoc](https://typedoc.org/) to automatically build the API documentation, to generate it:

```bash
yarn build:doc # or npm build:doc
```

Documentation is automatically deployed on each commit to master and is hosted in [Github Pages](https://pages.github.com/) in this [link](https://deyvi-dev.github.io/firebase-orm).

## License

MIT © [Willy Ovalle](https://github.com/deyvi-dev). See [LICENSE](https://github.com/deyvi-dev/firebase-orm/blob/master/LICENSE) for details.
