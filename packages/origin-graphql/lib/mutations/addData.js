import { post } from 'origin-utils/lib/ipfsHash'
import txHelper, { checkMetaMask } from './_txHelper'

async function addData(_, data, context) {
  await checkMetaMask(context, data.from)
  const ipfsHash = await post(context.contracts.ipfsRPC, data)

  let args = [ipfsHash]
  if (data.offerID) {
    args = [data.listingID, data.offerID, ipfsHash]
  } else if (data.listingID) {
    args = [data.listingID, ipfsHash]
  }

  const tx = context.contracts.marketplaceExec.methods.addData(...args).send({
    gas: 4612388,
    from: data.from || web3.eth.defaultAccount
  })
  return txHelper({
    tx,
    context,
    mutation: 'addData'
  })
}

export default addData
