# Reading Data

This is where fun starts! Once we have [initialized](README.md#Initialization) firebase-orm in our application we can start using it!

We'll continue working with the Band's collection we defined in [Core Concept's](CORE_CONCEPTS.md#FirebaseORMCollections) section.

## Simple Queries

Firebase-orm [Repositories](CORE_CONCEPTS.md#FirebaseORMRepositories) have the method [findById](Classes/Classes/BaseFirestoreRepository.md#FindById) which you can use to retrieve documents by its... id, duh.

Let's imagine we have a Document in our Bands Collection in firestore with an id `red-hot-chilli-peppers`. To retrieve it we only have to use the handy [findById](Classes/BaseFirestoreRepository.md#FindById) method in our repository!

```typescript
import { Collection, getRepository } from 'firebase-orm';

@Collection()
class Band {
  id: string;
  name: string;
  formationYear: number;
  genres: Array<string>;
}

const bandRepository = getRepository(Band);

const band = await bandRepository.findById('red-hot-chilli-peppers');
```

Now the variable band is an instance of our Band model that contains the information about the band! (Red Hot Chilli Peppers is awesome, btw!)

## Complex Queries

Only being able to find documents by id is a bit limiting, that's why firebase-orm repositories provide a lot of helper functions to ease the filtering of data in queries. These are [whereEqualTo](Classes/BaseFirestoreRepository.md#WhereEqualTo), [whereGreaterThan](Classes/BaseFirestoreRepository.md#WhereGreaterThan), [whereGreaterOrEqualTha](Classes/BaseFirestoreRepository.md#WhereGreaterOrEqualThan), [whereLessThan](Classes/BaseFirestoreRepository.md#WhereLessThan), [whereLessOrEqualThan](Classes/BaseFirestoreRepository.md#WhereLessOrEqualThan), [whereArrayContains](Classes/BaseFirestoreRepository.md#WhereArrayContains), [whereIn](Classes/BaseFirestoreRepository.md#whereIn), and [whereArrayContainsAny](Classes/BaseFirestoreRepository.md#whereArrayContainsAny) methods. We can pipe as many methods as we need to perform complex queries, as long as we don’t forget to call the [find](Classes/BaseFirestoreRepository.md#Find) method at the end.

```typescript
// Bands formed from 1990 onwards
await bandRepository.whereGreaterOrEqualThan('formationYear', 1990).find();

// Bands whose name is Porcupine Tree
await bandRepository.whereEqualTo('name', 'Porcupine Tree').find();

// Bands formed after 1985 and that play Progressive Rock
await bandRepository
  .whereGreaterThan('formationYear', 1985)
  .whereArrayContains('genres', 'progressive-rock')
  .find();
```

All the \*Where methods have a similar api, where the first parameter is a string that represents the field that we want to search for and the second one is the value that we want to compare to (which can be any [JavaScript primitive type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values)). Firebase-orm also provide an alternative API to make it more type safe; the first parameter can also accept a lamda function where it's first parameter is the type of the model of the repository.

```typescript
// This example is exactly the same than the last one, but using the alternative API.

// Bands formed from 1990 onwards
await bandRepository.whereGreaterOrEqualThan(band => band.formationYear, 1990).find();

// Bands whose name is Porcupine Tree
await bandRepository.whereEqualTo(band => band.name, 'Porcupine Tree').find();

// Bands formed after 1985 and that play Progressive Rock
await bandRepository
  .whereGreaterThan(band => band.formationYear, 1985)
  .whereArrayContains(band => band.genres, 'progressive-rock')
  .find();
```

### Search by Document Reference

In [#115](https://github.com/deyvi-dev/firebase-orm/pull/105/) we added the ability to use firestore document references in queries. We can use the document reference as the value in any of the helpers function described above and we can see it in action [in this example](https://github.com/deyvi-dev/firebase-orm/blob/d8f79090b7006675f2cb5014bb5ca7a9dfbfa8c1/src/BaseFirestoreRepository.spec.ts#L478-L492) or [this one](https://github.com/deyvi-dev/firebase-orm/blob/master/test/functional/6-document-references.spec.ts).

```ts
// Fake DocumentReference
class FirestoreDocumentReference {
  id: string;
  path: string;
}

@Collection()
class BandWithReference {
  id: string;
  name: string;
  formationYear: number;
  genres: Array<string>;

  @Type(() => FirestoreDocumentReference)
  relatedBand?: FirestoreDocumentReference;
}

const pt = new Band();
pt.id = 'porcupine-tree';
pt.name = 'Porcupine Tree';
pt.formationYear = 1987;
pt.genres = ['psychedelic-rock', 'progressive-rock', 'progressive-metal'];

await bandRepository.create(pt);

// Filter documents by a doc reference
const band = await bandRepository.whereEqualTo(b => b.relatedBand, ptRef).find();

// Can also use the string api of the complex query
const band = await bandRepository.whereEqualTo('relatedBand', ptRef).find();
```

## Order By and Limit

Firebase-orm repositories also provide functions to order documents and limit the quantity of documents that we will retrieve. These are [orderByAscending](Classes/BaseFirestoreRepository.md#OrderByAscending), [orderByDescending](Classes/BaseFirestoreRepository.md#OrderByDescending) and [limit](Classes/BaseFirestoreRepository.md#Limit). Please be aware that you can only use one orderBy and one limit per query.

```typescript
// Bands formed from 1990 onwards or
await bandRepository
  .whereGreaterOrEqualThan(band => band.formationYear, 1990)
  .orderByAscending('name')
  .find();

// Top 10 bands whose formationYear is 1987 in ascending order by formationYear (using the alternative api)
await bandRepository
  .whereEqualTo(band => band.formationYear, 1987)
  .orderByAscending(band => band.formationYear)
  .limit(10)
  .find();

// Top 3 bands formed after 1985 and that play Progressive Rock
await bandRepository
  .whereGreaterThan(band => band.formationYear, 1985)
  .whereArrayContains(band => band.genres, 'progressive-rock')
  .limit(3)
  .find();
```

### Limitations on Complex queries

Please be aware that firebase-orm cannot circumvent [Firestore query limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations), we still have to create indexes if we want to create queries that involve more than one field.
