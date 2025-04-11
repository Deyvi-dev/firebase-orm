import { OrderByDirection, DocumentReference, CollectionReference, Timestamp, GeoPoint, FieldValue } from '@google-cloud/firestore';
import { Query } from '@google-cloud/firestore';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PartialWithRequiredBy<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type WithOptionalId<T extends IFirebaseOrmEntity> = T & Partial<Pick<T, 'id'>>;

export type IFirestoreVal = string | number | Date | boolean | DocumentReference | Timestamp | GeoPoint | FieldValue | null;

export enum FirestoreOperators {
  equal = '==',
  notEqual = '!=',
  lessThan = '<',
  greaterThan = '>',
  lessThanEqual = '<=',
  greaterThanEqual = '>=',
  arrayContains = 'array-contains',
  arrayContainsAny = 'array-contains-any',
  in = 'in',
  notIn = 'not-in',
}

export interface IFirestoreQueryLine {
  prop: string;
  val: IFirestoreVal | IFirestoreVal[];
  operator: FirestoreOperators;
}

export interface IOrderByParams {
  fieldPath: string;
  directionStr: OrderByDirection;
}

export type IQueryBuilderResult = IFirestoreQueryLine[];

export type IWherePropParam<T> = keyof T | ((t: T) => unknown);

export interface IFirebaseOrmEntity {
  id?: string;
}

export interface IFirebaseOrmQueryBuilder<T extends IFirebaseOrmEntity> {
  whereEqualTo(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereNotEqualTo(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereGreaterThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereGreaterOrEqualThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereLessThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereLessOrEqualThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereArrayContains(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereArrayContainsAny(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  whereIn(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  whereNotIn(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  limit(limitVal: number): IFirebaseOrmQueryBuilder<T>;
  orderByAscending(prop: IWherePropParam<T>): IFirebaseOrmQueryBuilder<T>;
  orderByDescending(prop: IWherePropParam<T>): IFirebaseOrmQueryBuilder<T>;
  customQuery(func: ICustomQuery<T>): IFirebaseOrmQueryBuilder<T>;
  find(): Promise<T[]>;
  findOne(): Promise<T | null>;
}

export interface IFirebaseOrmRepository<T extends IFirebaseOrmEntity> {
  whereEqualTo(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereNotEqualTo(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereGreaterThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereGreaterOrEqualThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereLessThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereLessOrEqualThan(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereArrayContains(prop: IWherePropParam<T>, val: IFirestoreVal): IFirebaseOrmQueryBuilder<T>;
  whereArrayContainsAny(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  whereIn(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  whereNotIn(prop: IWherePropParam<T>, val: IFirestoreVal[]): IFirebaseOrmQueryBuilder<T>;
  limit(limitVal: number): IFirebaseOrmQueryBuilder<T>;
  orderByAscending(prop: IWherePropParam<T>): IFirebaseOrmQueryBuilder<T>;
  orderByDescending(prop: IWherePropParam<T>): IFirebaseOrmQueryBuilder<T>;
  customQuery(func: ICustomQuery<T>): IFirebaseOrmQueryBuilder<T>;
  find(): Promise<T[]>;
  findOne(): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(item: PartialBy<T, 'id'>): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface ICustomQuery<T> {
  (query: Query, firestoreColRef: CollectionReference): Promise<Query>;
}

export interface IQueryExecutor<T> {
  execute(
    queries: IFirestoreQueryLine[],
    limitVal?: number,
    orderByObj?: IOrderByParams,
    single?: boolean,
    customQuery?: ICustomQuery<T>
  ): Promise<T[]>;
}

export interface IBatchRepository<T extends IFirebaseOrmEntity> {
  create(item: WithOptionalId<T>): void;
  update(item: T): void;
  delete(item: T): void;
}

export interface ISingleBatchRepository<T extends IFirebaseOrmEntity> extends IBatchRepository<T> {
  commit(): Promise<unknown>;
}

export interface IFirestoreBatchSingleRepository<T extends IFirebaseOrmEntity> extends IBatchRepository<T> {
  commit(): Promise<void>;
}

export interface IFirestoreBatch {
  getRepository<T extends IFirebaseOrmEntity>(entity: Constructor<T>): IBatchRepository<T>;
  getSingleRepository<T extends IFirebaseOrmEntity>(
    pathOrConstructor: EntityConstructorOrPath<T>
  ): IFirestoreBatchSingleRepository<T>;

  commit(): Promise<unknown>;
}

export interface IBaseRepository<T extends IFirebaseOrmEntity> {
  findById(id: string): Promise<T | null>;
  create(item: PartialBy<T, 'id'>): Promise<T>;
  update(item: PartialWithRequiredBy<T, 'id'>): Promise<PartialWithRequiredBy<T, 'id'>>;
  delete(id: string): Promise<void>;
}

export type IRepository<T extends IFirebaseOrmEntity> = IBaseRepository<T> &
  IFirebaseOrmQueryBuilder<T> &
  IQueryExecutor<T>;

export type ITransactionRepository<T extends IFirebaseOrmEntity> = IRepository<T>;

export interface ITransactionReference<T = IFirebaseOrmEntity> {
  entity: T;
  propertyKey: string;
  path: string;
}

export type ITransactionReferenceStorage = Set<ITransactionReference>;

export type ISubCollection<T extends IFirebaseOrmEntity> = IRepository<T> & {
  createBatch: () => IFirestoreBatchSingleRepository<T>;
  runTransaction<R = void>(executor: (tran: ITransactionRepository<T>) => Promise<R>): Promise<R>;
};

export type Constructor<T> = { new (): T };
export type EntityConstructorOrPathConstructor<T extends IFirebaseOrmEntity> = { new (): T };
export type IEntityConstructor = Constructor<IFirebaseOrmEntity>;
export type IEntityRepositoryConstructor = Constructor<IRepository<IFirebaseOrmEntity>>;
export type EntityConstructorOrPath<T> = Constructor<T> | string;

export interface IFirestoreTransaction<T extends IFirebaseOrmEntity = IFirebaseOrmEntity> {
  getRepository(entityOrConstructor: EntityConstructorOrPath<T>): IRepository<T>;
}

/**
 * Taken From: class-validator/validation/ValidationError.d.ts
 *
 * Options passed to validator during validation.
 */
export interface ValidatorOptions {
  /**
   * If set to true then validator will skip validation of all properties that are undefined in the validating object.
   */
  skipUndefinedProperties?: boolean;
  /**
   * If set to true then validator will skip validation of all properties that are null in the validating object.
   */
  skipNullProperties?: boolean;
  /**
   * If set to true then validator will skip validation of all properties that are null or undefined in the validating object.
   */
  skipMissingProperties?: boolean;
  /**
   * If set to true validator will strip validated object of any properties that do not have any decorators.
   *
   * Tip: if no other decorator is suitable for your property use @Allow decorator.
   */
  whitelist?: boolean;
  /**
   * If set to true, instead of stripping non-whitelisted properties validator will throw an error
   */
  forbidNonWhitelisted?: boolean;
  /**
   * Groups to be used during validation of the object.
   */
  groups?: string[];
  /**
   * If set to true, the validation will not use default messages.
   * Error message always will be undefined if its not explicitly set.
   */
  dismissDefaultMessages?: boolean;
  /**
   * ValidationError special options.
   */
  validationError?: {
    /**
     * Indicates if target should be exposed in ValidationError.
     */
    target?: boolean;
    /**
     * Indicates if validated value should be exposed in ValidationError.
     */
    value?: boolean;
  };
  /**
   * Settings true will cause fail validation of unknown objects.
   */
  forbidUnknownValues?: boolean;
}
