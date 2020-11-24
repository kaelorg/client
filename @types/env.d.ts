declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development';

    DISCORD_TOKEN: string;
    MONGOOSE_CONNECTION_STRING: string;
  }
}
