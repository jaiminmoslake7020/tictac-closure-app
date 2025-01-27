import axios from 'axios';

export const sendRequest = async (url: string, method: string, data: any) => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error sendRequest', error);
    return null;
  }
}

export const sendGetRequest = async (url: string) => {
  return sendRequest(url, 'GET', null);
}

export const sendPostRequest = async (url: string, data: any) => {
  return sendRequest(url, 'POST', data);
}
