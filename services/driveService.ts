
import { GOOGLE_CONFIG } from '../constants';

// Types for Google API
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initDriveApi = async (onInit: (success: boolean) => void) => {
  const gapiLoaded = new Promise<void>((resolve) => {
    window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: GOOGLE_CONFIG.API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      });
      gapiInited = true;
      resolve();
    });
  });

  const gisLoaded = new Promise<void>((resolve) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      scope: GOOGLE_CONFIG.SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    resolve();
  });

  await Promise.all([gapiLoaded, gisLoaded]);
  onInit(true);
};

export const handleAuthClick = (onSuccess: () => void) => {
  if (!tokenClient) return;

  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    onSuccess();
  };

  if (window.gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
};

export const signOut = () => {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken('');
  }
};

/**
 * Saves the entire app state to a JSON file on Google Drive in the specific folder.
 * Uses a filename unique to the user: taskflow_data_{username}.json
 */
export const saveToDrive = async (username: string, data: any) => {
  const fileName = `taskflow_data_${username}.json`;
  
  try {
    // 1. Search for the file in the specific folder
    const response = await window.gapi.client.drive.files.list({
      q: `'${GOOGLE_CONFIG.FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
      fields: 'files(id, name)',
    });
    
    const files = response.result.files;
    const fileContent = JSON.stringify(data);
    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_CONFIG.FOLDER_ID], // Only needed on create, ignored on update if not moving
      mimeType: 'application/json',
    };

    if (files && files.length > 0) {
      // 2. File exists, update it
      const fileId = files[0].id;
      // We use a simplified upload approach for text/json
      const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${window.gapi.client.getToken().access_token}`,
          'Content-Type': 'application/json'
        },
        body: fileContent
      });
      console.log('File updated on Drive');
    } else {
      // 3. File does not exist, create it
      // Standard multipart upload for metadata + content
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";
      
      const contentType = 'application/json';
      
      const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(fileMetadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n\r\n' +
          fileContent +
          close_delim;

      await window.gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
      });
      console.log('File created on Drive');
    }
    return true;
  } catch (error) {
    console.error("Error saving to Drive", error);
    throw error;
  }
};

/**
 * Loads data from the user's file on Google Drive
 */
export const loadFromDrive = async (username: string) => {
  const fileName = `taskflow_data_${username}.json`;
  
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `'${GOOGLE_CONFIG.FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
      fields: 'files(id, name)',
    });
    
    const files = response.result.files;
    if (files && files.length > 0) {
      const fileId = files[0].id;
      const result = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });
      return result.result; // The JSON object
    }
    return null; // File not found
  } catch (error) {
    console.error("Error loading from Drive", error);
    return null;
  }
};
