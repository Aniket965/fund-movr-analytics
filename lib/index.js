import { BigNumber, ethers } from "ethers";
import registryV0Abi from '../assets/registryV0.json';
import registryV1Abi from '../assets/registryV1.json';
import {routesV1, routeV1} from './routev1';
import {routes} from '@movr/fund-movr-core'
import {createfetchUnlessCached} from "fetch-unless-cached"

const cachedFetch = createfetchUnlessCached(500)

const V0RegistryDecoder = new ethers.utils.Interface(registryV0Abi);
const V1RegistryDecoder = new ethers.utils.Interface(registryV1Abi);


export const handleData = async () => {
  const ethereumData = await handleEthereumV0();
  const ethereumDataV1 = await handleEthereumV1();
  const polygonData = await handlePolygonV0();
  const polygonDataV1 = await handlePolygonV1();
  const binanceData = await handleBinanceV0();
  const binanceDataV1 = await handleBinanceV1();
  const fantomDataV1 = await handleFantomV1();
  const xdaiData = await handleXdaiV0();
  const xdaiDataV1 = await handleXdaiV1();

  const totaldata = mergeData([ethereumData,polygonData,binanceData,polygonDataV1,binanceDataV1,ethereumDataV1,fantomDataV1]);
  const data = {
    'totalAmount': totaldata.totalAmountInUsd,
    'totalAmountLeft': ethers.BigNumber.from('10000000').sub(totaldata.totalAmountInUsd),
    'stats': {
      'Total': totaldata,
      'Mainnet ': ethereumData,
      'Mainnet V1': ethereumDataV1,
      'Polygon': polygonData,
      'Polygon V1': polygonDataV1,
      'Binance': binanceData,
      'Binance V1': binanceDataV1,
      'XDai': xdaiData,
      'XDai V1': xdaiDataV1,
      'Fantom V1': fantomDataV1,
      
    }


  }
  return data;
}

export const mergeData = (chainsData) => {
  let txs = [];
  const bridgeWiseTxs = {};
  const middlewareTxs = {};
  const chainId = 0;
  let totalAmount = BigNumber.from(0);
  chainsData.map(chainData => {
    txs = txs.concat(chainData.txs)
    Object.keys(chainData.bridgeWiseTxs).map(bridgeName => {
      if(!bridgeWiseTxs[bridgeName])bridgeWiseTxs[bridgeName] = []
      bridgeWiseTxs[bridgeName] = bridgeWiseTxs[bridgeName].concat(chainData.bridgeWiseTxs[bridgeName])
    }) 

    totalAmount = totalAmount.add(chainData.totalAmountInUsd)

    Object.keys(chainData.middlewareTxs).map(middlewareName => {
      if(!middlewareTxs[middlewareName])middlewareTxs[middlewareName] = []
      middlewareTxs[middlewareName] = middlewareTxs[middlewareName].concat(chainData.middlewareTxs[middlewareName])
    }) 
  })
  return {
    chainId,
    txs,
    bridgeWiseTxs: bridgeWiseTxs,
    middlewareTxs: middlewareTxs,
    totalAmountInUsd: totalAmount,
    color: 'black'
  }
}

export const handleXdaiV0 = async () => {
  const registryAddress = "0xaD8D3C555c2abc9713Cb5d2ff03b59343ff4c4Ad";
  const chainId = 100;
  const data = await fetch(
    `https://blockscout.com/xdai/mainnet/api?module=account&action=txlist&address=${registryAddress}`, { mode: 'no-cors'}
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 100, 'green-400');
  return chainStats;
}
export const handleXdaiV1 = async () => {
  const registryAddress = "0xc30141b657f4216252dc59af2e7cdb9d8792e1b0";
  const chainId = 100;
  const data = await fetch(
    `https://blockscout.com/xdai/mainnet/api?module=account&action=txlist&address=${registryAddress}`, { mode: 'no-cors'}
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 100, 'green-400');
  return chainStats;
}
export const handleBinanceV0 = async () => {
  const registryAddress = "0x0b6a733c770ada091bff20d60a569e96ad695d2f";
  const chainId = 56;
  const data = await cachedFetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 56, 'yellow-400');
  return chainStats;
}
export const handleBinanceV1 = async () => {
  const registryAddress = "0xc30141b657f4216252dc59af2e7cdb9d8792e1b0";
  const chainId = 56;
  const data = await cachedFetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV1(transactions, 56, 'yellow-400');
  return chainStats;
}
export const handlePolygonV0 = async () => {
    const registryAddress = "0xca09f09e0f7b93f19e5a29fbe0486606ff32bb4e";
    const chainId = 137;
    const data = await cachedFetch(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
    );
    let transactions = [];
    if (data.status === "1") {
      transactions = data.result.reduce((txs, tx) => {
        try {
          const hash = tx.hash;
          const input = tx.input;
          txs.push({
            hash,
            input,
            chainId,
          });
        } catch (err) {
          console.log(err);
        }
        return txs;
      }, []);
    }
    const chainStats = await getChainStatsV0(transactions, 137,'purple-400');
    return chainStats;
}

export const handlePolygonV1 = async () => {
  const registryAddress = "0xc30141b657f4216252dc59af2e7cdb9d8792e1b0";
  const chainId = 137;
  const data = await cachedFetch(
    `https://api.polygonscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV1(transactions, 137,'purple-400');
  return chainStats;
}


export const handleEthereumV1 = async () => {
  const registryAddress = "0xc30141b657f4216252dc59af2e7cdb9d8792e1b0";
  const chainId = 1;
  const data = await cachedFetch(
    `https://api.etherscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV1(transactions, 1, 'gray-400');
  return chainStats;
}


export const handleFantomV1 = async () => {
  const registryAddress = "0xc30141b657f4216252dc59af2e7cdb9d8792e1b0";
  const chainId = 250;
  const data = await cachedFetch(
    `https://api.ftmscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV1(transactions, chainId, 'blue-400');
  return chainStats;
}
export const handleEthereumV0 = async () => {
  const registryAddress = "0x6d290609b3f5f02d52f28d97c75a443ed8564cbf";
  const chainId = 1;
  const data = await cachedFetch(
    `https://api.etherscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.hash;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 1, 'gray-400');
  return chainStats;
}

export const getBridgeNameFromBridgeId = (bridgeId,chainId, v1=false) => {
  return v1 ? routesV1[chainId].bridgeNames[bridgeId] : routes[chainId].bridgeNames[bridgeId]
}

export const getMiddlewareNameFromMiddlewareId = (middlewareId,chainId, v1=false) => {
  if(middlewareId === 0) return 'no-middleware';
  return v1 ? routesV1[chainId].middlewareNames[middlewareId] : routes[chainId].middlewareNames[middlewareId]
}

export const getTokenPrice = async (tokenAddress, chainId) => {
  const _tokenAddress = tokenAddress.toLowerCase();
  const data = await cachedFetch(
    `http://localhost:8000/v1/token-price?tokenAddress=${_tokenAddress}&chainId=${chainId}`
  );
  return data.result;
}

export const getTokenUSDValue = async (tokenAddress, chainId, amount) => {
    const tokenPriceData = await getTokenPrice(tokenAddress,chainId);
    const _amt = (ethers.BigNumber.from(amount).div(
      ethers.BigNumber.from(10).pow(tokenPriceData.decimals)
    ).toNumber() * tokenPriceData.tokenPrice)  
    return ethers.BigNumber.from(Math.floor(_amt));
}
export const getChainStatsV0 = async (transactions,chainId,color) => {
    const totalAmountInUsd = BigNumber.from(0);
    const txs = [];
    const bridgeWiseTxs = {}
    const middlewareTxs = {}
    await Promise.all(transactions.map(async (tx) => {
            try {
                const input = tx.input;
                const txHash = tx.hash;
                const decodedData = V0RegistryDecoder.decodeFunctionData('outboundTransferTo', input)[0];
                const amount = ethers.BigNumber.from(decodedData.amount);
                const middlewareInputToken = decodedData.middlewareInputToken;
                const bridgeInputToken = decodedData.tokenToBridge;
                const middlewareId = ethers.BigNumber.from(decodedData.middlewareID).toNumber();
                const bridgeId = ethers.BigNumber.from(decodedData.bridgeID).toNumber();
                let tokenAddress = middlewareInputToken;
                if(middlewareId === 0) tokenAddress = bridgeInputToken;
                const usdValue = await getTokenUSDValue(tokenAddress,chainId, amount);
                const bridgeName = getBridgeNameFromBridgeId(bridgeId, chainId);
                const middlewareName = getMiddlewareNameFromMiddlewareId(middlewareId, chainId)
                const _tx = {
                  hash:txHash,
                  amount,
                  tokenAddress,
                  usdValue,
                  bridgeName,
                  middlewareName,
                }
                txs.push(_tx);

                if(!bridgeWiseTxs[bridgeName]) bridgeWiseTxs[bridgeName] = []
                bridgeWiseTxs[bridgeName].push(_tx)

                if(!middlewareTxs[middlewareName]) middlewareTxs[middlewareName] = []
                middlewareTxs[middlewareName].push(_tx)
                totalAmountInUsd = totalAmountInUsd.add(usdValue);
            }catch(err) {
                console.log(err)
            } 
          
    }))
    return {
      chainId,
      txs,
      bridgeWiseTxs,
      middlewareTxs,
      totalAmountInUsd,
      color
    }
}
export const getChainStatsV1 = async (transactions,chainId,color) => {
  const totalAmountInUsd = BigNumber.from(0);
  const txs = [];
  const bridgeWiseTxs = {}
  const middlewareTxs = {}
  await Promise.all(transactions.map(async (tx) => {
          try {
              const input = tx.input;
              const txHash = tx.hash;
              const decodedData = V1RegistryDecoder.decodeFunctionData('outboundTransferTo', input)[0];
              const amount = ethers.BigNumber.from(decodedData.amount);
              const middlewareInputToken = decodedData.middlewareRequest.inputToken;
              const toChainId = decodedData.toChainId.toString();
              const bridgeInputToken = decodedData.bridgeRequest.inputToken;
              const middlewareId = ethers.BigNumber.from(decodedData.middlewareRequest.id).toNumber();
              const bridgeId = ethers.BigNumber.from(decodedData.bridgeRequest.id).toNumber();
              let tokenAddress = middlewareInputToken;
              if(middlewareId === 0) tokenAddress = bridgeInputToken;
              const usdValue = await getTokenUSDValue(tokenAddress,chainId, amount);
              const bridgeName = getBridgeNameFromBridgeId(bridgeId, chainId, true);
              const middlewareName = getMiddlewareNameFromMiddlewareId(middlewareId, chainId, true)
              const _tx = {
                hash:txHash,
                amount,
                tokenAddress,
                usdValue,
                bridgeName,
                middlewareName,
                toChainId
              }
              txs.push(_tx);

              if(!bridgeWiseTxs[bridgeName]) bridgeWiseTxs[bridgeName] = []
              bridgeWiseTxs[bridgeName].push(_tx)

              if(!middlewareTxs[middlewareName]) middlewareTxs[middlewareName] = []
              middlewareTxs[middlewareName].push(_tx)
              totalAmountInUsd = totalAmountInUsd.add(usdValue);
          }catch(err) {
              console.log(err)
          } 
        
  }))
  return {
    chainId,
    txs,
    bridgeWiseTxs,
    middlewareTxs,
    totalAmountInUsd,
    color
  }
}
