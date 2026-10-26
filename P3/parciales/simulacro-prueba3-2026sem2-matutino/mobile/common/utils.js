import Constants from 'expo-constants';

export function expoDevServerUri(path) {
  let expoBaseUri = Constants.expoConfig?.hostUri ?? window.location.href;
  if (!/^https?:\/\//.test(expoBaseUri)) {
    expoBaseUri = `http://${expoBaseUri}`;
  }
  return new URL(path, expoBaseUri ?? window.location.href).toString();
}