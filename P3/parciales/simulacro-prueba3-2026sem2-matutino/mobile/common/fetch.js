import { expoDevServerUri } from './utils';

export async function fetchJSON(resource, options = undefined) {
  options = {
    method: 'GET',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  };
  const response = await fetch(expoDevServerUri(resource), options);
  if (!response.ok) {
    const error = new Error(
      `${options.method} ${resource} failed with ${response.status} ${response.statusText}!`,
    );
    error.status = response.status;
    throw error;
  }
  return await response.json();
}
