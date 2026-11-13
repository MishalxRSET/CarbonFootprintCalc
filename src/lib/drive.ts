import { DriveFileItem } from '../types';

/**
 * Search user's Google Drive for files, prioritizing "CARBON FOOTPRINT REDUCTION.pptx"
 */
export async function searchDriveFiles(
  accessToken: string,
  searchQuery = 'CARBON FOOTPRINT REDUCTION'
): Promise<{ files: DriveFileItem[]; targetFound: boolean }> {
  try {
    // Construct query to find presentations and relevant carbon reduction documents
    const query = encodeURIComponent(
      `name contains '${searchQuery}' and trashed = false`
    );
    const fields = encodeURIComponent(
      'files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink, thumbnailLink, description, owners)'
    );
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=15&orderBy=modifiedTime desc`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED_EXPIRED_TOKEN');
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Google Drive API error (${response.status})`);
    }

    const data = await response.json();
    const files: DriveFileItem[] = data.files || [];

    // Check if the exact target file or a matching pptx exists
    const targetFound = files.some(
      (f) =>
        f.name.toLowerCase().includes('carbon footprint reduction') &&
        (f.name.toLowerCase().endsWith('.pptx') || f.mimeType.includes('presentation'))
    );

    return { files, targetFound };
  } catch (error) {
    console.error('Error querying Google Drive API:', error);
    throw error;
  }
}

/**
 * Fetch generic drive files or list of recent presentations to give the user quick access
 */
export async function listRecentDrivePresentations(
  accessToken: string
): Promise<DriveFileItem[]> {
  try {
    const query = encodeURIComponent(
      `(mimeType = 'application/vnd.google-apps.presentation' or mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation' or name contains 'Carbon' or name contains 'Sustainability') and trashed = false`
    );
    const fields = encodeURIComponent(
      'files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink, thumbnailLink, description, owners)'
    );
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=10&orderBy=modifiedTime desc`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw new Error(`Drive list error: ${res.status}`);
    const json = await res.json();
    return json.files || [];
  } catch (e) {
    console.warn('Could not list recent presentations:', e);
    return [];
  }
}
