import { Web3Storage } from "web3.storage";

async function makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
  }

export default async function  getCidInfo(cid){
  const returnValues = {};
  const storage = await makeStorageClient();
  const cidReadRes = await storage.get(cid);
 
  const { files, } = cidReadRes;
  response["files"] = [...files];

  const cidStatusRes = await storage.status(cid);
  const { pins, deals} = cidReadRes; 
  response["pins"] = [...pins];
  response["deals"] = [...deals];
  return response;
}
