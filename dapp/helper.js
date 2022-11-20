import { Web3Storage } from 'web3.storage';


async function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

const helpers = {
  getCidInfo: async function (cid) {
    console.log('helper called');
    const returnValues = {};
    const storage = await makeStorageClient();

    //const cidtest = "bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe";
    const resdata = await storage.get(cid); 
 
    const filesReterived = await resdata.files(); 

    const files = []
    for (const file of filesReterived) {
     console.log(file);
     console.log(`${file.cid} ${file.name} ${file.size}`);
     files.push(file);
    }

    const video = files[1];
    console.log(video);

    // 'https://bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe.ipfs.w3s.link/ipfs/bafybeidtig7gruy5yirxjhbp675apd3qkrr6soawhh7bhpj7l4sdp7pawe/sample-5s.mp4';
    returnValues["url"]=` 'https://${cid}.ipfs.w3s.link/ipfs/${cid}/sample-5s.mp4'`;
    returnValues["name"]=video.name;
    returnValues["type"]="video/mp4";

    returnValues["files"] = [...files]

    console.log(returnValues);
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
