import { Web3Storage } from 'web3.storage';


async function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

const helpers = {
  getCidInfo: async function (cid) {
    console.log('helper called');
    const returnValues = {};
    const storage = await makeStorageClient();

    const cidtest = "bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe";
    const resdata = await storage.get(cidtest); 
 
    const filesReterived = await resdata.files(); 

    const files = []
    for (const file of filesReterived) {
     console.log(file);
     console.log(`${file.cid} ${file.name} ${file.size}`);
     files.push(file);
    }

    returnValues["files"] = [...files]
    return  returnValues; 
    /*const resdata = await storage.get(cid); 
    const filesReterived = await resdata.files(); 
    
    const cidReadRes = await storage.get(cid);
    console.log(cidReadRes)

    const filesReterived = await cidReadRes.files();

    const files=[]
    for (const file of filesReterived) {
      console.log(file);
      console.log(`${file.cid} ${file.name} ${file.size}`);
      // files.push(file);
    }*/
  


    // returnValues['files'] = [...files];
    /*const status = await storage.status(cid);
    returnValues['status'] = status;
    console.log('helper done');*/
    //return returnValues;
  },
};

export default helpers;
