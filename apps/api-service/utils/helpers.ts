export const constructDbUrl = ({
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_URL_HOST,
}: {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_URL_HOST: string;
}) => {
  return `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL_HOST}:${DB_PORT}/${DB_NAME}`;
};
