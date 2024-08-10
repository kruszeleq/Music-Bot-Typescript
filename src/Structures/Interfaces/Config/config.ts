export interface Config {
  TOKEN: string;
  CLIENT_ID: string;
  DevGuilds: [
    {
      name: string;
      id: string;
    }
  ];
  Database: {
    MongoDB: string;
  };
  DEVELOPMENT: boolean;
}
