import request from '../request';

export const getAllNfts = () => {
  const options = {
    url: 'http://localhost:3000/api/nft',
    method: 'get'
  };

  return request(options)
    .then((res: any) => res)
    .catch((err) => console.log('error', err));
};
