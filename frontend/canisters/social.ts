import { ActorSubclass } from "@dfinity/agent";
import { Canister } from "@bundly/ic-core-js";

// This ignore is required because there's an error with its d.ts file
import { _SERVICE } from "../src/declarations/social/social.did";
// @ts-ignore
import { idlFactory } from "../src/declarations/social/social.did.js";

// Used to type useActor hook
export type UserActor = ActorSubclass<_SERVICE>;

// Used to build Actor
export const user: Canister = {
  idlFactory,
  configuration: {
    canisterId: process.env.USER_CANISTER_ID,
  },
};