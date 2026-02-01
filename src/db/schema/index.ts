/**
 * Database schema types - re-exports all table types and mappers
 */

// User
export type { User, UserRow, CreateUserInput, UpdateUserInput } from './user';
export { toUser, toUserRow } from './user';

// Tree
export type { Tree, TreeRow, CreateTreeInput, UpdateTreeInput } from './tree';
export { toTree, toTreeRow } from './tree';

// TreeMember
export type {
	TreeMember,
	TreeMemberRow,
	TreeMemberRole,
	CreateTreeMemberInput,
	UpdateTreeMemberInput
} from './tree-member';
export { toTreeMember, toTreeMemberRow } from './tree-member';

// Person
export type {
	Person,
	PersonRow,
	Gender,
	GenderCode,
	CreatePersonInput,
	UpdatePersonInput
} from './person';
export { toPerson, toPersonRow, genderToCode, genderFromCode } from './person';

// Union
export type {
	Union,
	UnionRow,
	UnionType,
	UnionStatus,
	CreateUnionInput,
	UpdateUnionInput
} from './union';
export { toUnion, toUnionRow } from './union';

// ParentChild
export type {
	ParentChild,
	ParentChildRow,
	RelationshipType,
	CreateParentChildInput,
	UpdateParentChildInput
} from './parent-child';
export { toParentChild, toParentChildRow } from './parent-child';
