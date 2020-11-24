declare module 'messier' {
  import { EventEmitter } from 'events';

  export class Collection<K, V> extends Map<K, V> {
    filter(callback: (value: V) => boolean): this;

    some(callback: (value: V) => boolean): boolean;

    find(callback: (value: V) => boolean): V | undefined;
  }

  //

  export class RESTManager {
    get api(): any;
  }

  //

  export class Shard {
    readonly unavailableGuilds: Set<string>;
  }

  export class ShardManager extends Collection<number, Shard> {
    get ready(): boolean;
  }

  export class Client extends EventEmitter {
    readonly rest: RESTManager;

    readonly shardManager: ShardManager;

    readonly guilds: Collection<string, Guild>;

    constructor(token: string, options?: Record<string, any>);

    get api(): RESTManager['api'];

    connect(): Promise<void>;
  }

  // Structures

  export class Structure {
    name: string;

    readonly id: string;

    readonly client: Client;
  }

  export class MessageEmbed {
    constructor(...props: any[]);
  }

  export class Role extends Structure {}

  export class Emoji extends Structure {}

  export class Channel extends Structure {
    readonly type: string;

    send(...props: any[]): Promise<any>;

    edit(data: Record<string, any>): Promise<this>;
  }

  export class Member extends Structure {
    readonly roles: Collection<string, Role>;

    get tag(): string;

    get user(): Member;

    get mention(): string;

    addRole(id: string): Promise<this>;

    addRole(id: string): Promise<this>;

    addRole(id: string[]): Promise<this>;

    removeRole(id: string): Promise<this>;

    removeRole(id: string[]): Promise<this>;
  }

  export class Guild extends Structure {
    memberCount: number;

    readonly roles: Collection<string, Role>;

    readonly emojis: Collection<string, Emoji>;

    readonly members: Collection<string, Member>;

    readonly channels: Collection<string, Channel>;

    requestMembers(): void;

    fetchMember(id: string): Promise<Member>;
  }
}
