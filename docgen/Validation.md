# Validation

Firebase-ORM supports [class-validator](https://github.com/typestack/class-validator) validation decorators in any collection.

As `class-validator` requires a single install per project, Firebase-ORM opts not to depend on it explicitly (doing so may result in conflicting versions). It is up to you to install it with `npm i -S class-validator`.

Once installed correctly, you can write your collections like so:

```typescript
import { Collection } from 'firebase-orm';
import { IsEmail } from 'class-validator';

@Collection()
class Band {
  @IsEmail()
  contactEmail: string;
}
```

Use this in the same way that you would your other collections and it will validate whenever a document is saved or updated. [Read more about managing data.](Manage_Data.md)

## Disabling validation

Model validation is not enabled by default. It can be enable by initializing Firebase-ORM with the `validateModels: true` option.

```typescript
initialize(firestore, {
  validateModels: true,
});
