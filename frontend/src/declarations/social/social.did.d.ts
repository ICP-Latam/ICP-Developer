import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ImageObject = Uint8Array | number[];
export interface Post {
  'creator' : string,
  'message' : string,
  'image' : ImageObject,
}
export interface _SERVICE {
  'createPost' : ActorMethod<[string, ImageObject], undefined>,
  'deletePost' : ActorMethod<[string], boolean>,
  'getPost' : ActorMethod<[string], [] | [Post]>,
  'getPosts' : ActorMethod<[], Array<[string, Post]>>,
  'updatePost' : ActorMethod<[string, string], boolean>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
