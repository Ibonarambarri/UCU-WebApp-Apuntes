export async function fetchJSON(resource, options = undefined) {
  let resourceURL = null;
  try {
    resourceURL = new URL(resource, window.location.origin);
  } catch {
    throw new Error(`Invalid resource URL ${resource}!`);
  }
  options = {
    method: 'GET',
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  };
  const response = await fetch(resourceURL, options);
  if (!response.ok) {
    throw new Error(
      `${options?.method ?? 'GET'} ${resource} failed with ${response.status} ${response.statusText}!`,
    );
  }
  return await response.json();
}