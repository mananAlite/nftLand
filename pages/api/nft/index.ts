import type { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from 'mongodb';

import clientPromise from '../../../utils/connect';
import { MONGODB_DB } from '../../../constant/Mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(MONGODB_DB);

  const { method, body } = req;
  const {
    name,
    owner_address,
    description,
    ipfs_uri,
    image_ipfs_uri,
    collection_id,
    isForSale,
    isForAuction,
    tokenAmount
  } = body;

  switch (method) {
    case 'POST':
      try {
        const findUser = await db.collection('User').findOne({ wallet_address: owner_address as string });
        const findCollection = await db
          .collection('collections')
          .findOne({ _id: new ObjectId(collection_id as string) });

        const findMintNFT = await db
          .collection('nft-collection')
          .find({ collection_id: new ObjectId(collection_id as string) })
          .toArray();

        const token_id = findMintNFT?.length + 1;

        if (findCollection) {
          const createNFT = await db.collection('nft-collection').insertOne({
            name,
            user_id: findUser!._id,
            description,
            ipfs_uri,
            image_ipfs_uri,
            collection_id: findCollection!._id,
            collection_name: findCollection!.name,
            isForSale,
            isForAuction,
            tokenAmount,
            token_id: token_id,
            likes: [],
            created_at: new Date(),
            updated_at: new Date()
          });
          return res.status(201).json({
            message: 'NFT Create Successfully',
            data: createNFT
          });
        } else {
          return res.status(404).json({
            message: 'Collection not found'
          });
        }
      } catch (err: any) {
        console.log(':rocket: ~ file: index.ts ~ line 20 ~ handler ~ err', err);
        return res.status(500).json({ err: err.message });
      }
    case 'GET':
      try {
        const getNFTs = await db.collection('nft-collection').find().toArray();
        return res.status(201).json({
          message: 'Get all NFTS',
          data: getNFTs
        });
      } catch (err: any) {
        console.log('🚀 ~ file: index.ts ~ line 20 ~ handler ~ err', err);
        return res.status(500).json({ err: err.message });
      }
  }
}
