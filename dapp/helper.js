import { Web3Storage } from 'web3.storage';

async function makeStorageClient() {
  return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN });
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

const helpers = {
  getCidInfo: async function (cid) {
    console.log('helper called');
    const ret = [];
    const storage = await makeStorageClient();
    var counter = 0;
    for await (const item of storage.list({ maxResults: 10 })) {
      ret[counter];
      const cid = item.cid;
      var link = `https://w3s.link/ipfs/${cid}/metadata.json`;
      var data = readTextFile(link, function (text) {
        data = JSON.parse(text);
        // console.log(data);
        // console.log(data.title);
        // ret[counter].push(data.title);
        // for (const [key, value] of Object.entries(data)) {
        //   ret[counter][key] = value;
        // }
        // console.log(ret);
      });
      counter += 1;
    }
    console.log(ret);

    // console.log(uploadNames['cid']);
    // const resdata = await storage.get(
    //   'bafybeihtlkbdrz4lsolxfx442goxrd7bbs2l3ootemtlcmuaex4u43kxq4'
    // );
    // const filesReterived = await resdata.files();
    // // console.log(filesReterived);
    // // const files = []
    // for (const file of filesReterived) {
    //   console.log(file);
    //   console.log(`${file.cid} ${file.name} ${file.size}`);
    //   //  files.push(file);
    // }

    // const video = files[1];
    // console.log(video);

    // 'https://bafybeigypumrbf2np5u7p5mcukwoxqv3f2qyhnfp2756z4dy433ofets64.ipfs.w3s.link/ipfs/bafybeigypumrbf2np5u7p5mcukwoxqv3f2qyhnfp2756z4dy433ofets64/sample-5s.mp4';
    // const metaData = loadJSON(
    //   `https://${cid}.ipfs.w3s.link/ipfs/metadata.json`
    // );
    // console.log(metaData);
    returnValues['url'] =
      'https://ipfs.io/ipfs/bafybeicq7qd5ns67yfnwfclhunwifsgqptcddvhdfklnz5deopa4apr4qu/duckroll.mp4';
    returnValues['type'] = 'video/mp4';
    // const status = await storage.status(cid);
    // console.log(status);
    // returnValues['status'] = status;
    // console.log(returnValues);
    // console.log('helper done');
    // return returnValues;
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
    //return returnValues;
  },
};

export default helpers;
