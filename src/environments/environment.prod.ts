import packageInfo from '../../package.json';
export const environment = {
  production: true,
  backendHost : "http://localhost:8085",
  version: packageInfo.version
};
