import { Web3Storage } from 'web3.storage';

async function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

const helpers = {
  getCidInfo: async function (cid) {
    console.log('helper called');
    const returnValues = {};
    const storage = await makeStorageClient();
    const cidReadRes = await storage.get(cid);

    const res = await cidReadRes.files();
    returnValues['files'] = res;
    const status = await storage.status(cid);
    returnValues['status'] = status;
    console.log('helper done');
    return returnValues;
  },
};

export default helpers;
