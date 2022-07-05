import axios from 'axios';

interface requestProps {
  url: string;
  method: string;
  payload?: JSON;
  headers?: {};
}

export default function request(params: requestProps) {
  return new Promise((resolve, reject) => {
    const allowedMethods = ['get', 'post', 'put', 'patch', 'delete'];

    if (allowedMethods.indexOf(params.method.toLowerCase()) < 0) {
      throw new Error(`
      Invalid method type please provide one of these methods... \n${allowedMethods}`);
    } else {
      axios({
        method: params.method,
        url: params.url,
        data: params.payload,
        headers: params.headers
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}
