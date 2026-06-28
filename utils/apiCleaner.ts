import { APIResponse } from '@playwright/test';

export async function cleanApiResponse(response: APIResponse) {
  const responseText = await response.text();
  const jsonStart = responseText.indexOf('{');
  return jsonStart !== -1 ? responseText.substring(jsonStart) : responseText;
}
