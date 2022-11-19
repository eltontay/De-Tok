require("hardhat-deploy");
require("hardhat-deploy-ethers");

const ethers = require("ethers");
const fa = require("@glif/filecoin-address");
const util = require("util");
const request = util.promisify(require("request"));

const DEPLOYER_PRIVATE_KEY = network.config.accounts[0];

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

async function callRpc(method, params) {
  var options = {
    method: "POST",
    url: "https://wallaby.node.glif.io/rpc/v0",
    // url: "http://localhost:1234/rpc/v0",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  };
  const res = await request(options);
  return JSON.parse(res.body).result;
}

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;


  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");
  const f4Address = fa.newDelegatedEthAddress(deployer.address).toString();
  const nonce = await callRpc("Filecoin.MpoolGetNonce", [f4Address]);

  console.log("Wallet Ethereum Address:", deployer.address);
  console.log("Wallet f4Address: ", f4Address)


  await deploy("DeTokCoin", {
    from: deployer.address,
    args: [],
    gasLimit: 1000000000, // BlockGasLimit / 10
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });

  await deploy("DeTokVideo", {
    from: deployer.address,
    args: [],
    gasLimit: 1000000000, // BlockGasLimit / 10
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });

  const deTokCoin = await deployments.get("DeTokCoin")
  const deTokVideo = await deployments.get("DeTokVideo")

  await deploy("DeTokCollection", {
    from: deployer.address,
    args: [deTokCoin.address,deTokVideo.address],
    gasLimit: 1000000000, // BlockGasLimit / 10
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });
 
};


module.exports.tags = ["DeTokCoin", "DeTokVideo"];