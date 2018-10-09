import { post } from 'origin-utils/lib/ipfsHash'
import txHelper, { checkMetaMask } from './_txHelper'
const ZeroAddress = "0x0000000000000000000000000000000000000000";

async function makeOffer(_, data, context) {
  const buyer = await checkMetaMask(context, data.from)
  const marketplace = context.contracts.marketplaceExec

  data = {
    finalizes: String(1000 * 60 * 60 * 48), // 2 days
    affiliate: ZeroAddress,
    commission: "0",
    currency: ZeroAddress,
    arbitrator: ZeroAddress,
    ...data
  }

  const affilaiteWhitelistDisabled = await marketplace.methods
    .allowedAffiliates(marketplace.options.address)
    .call()

  if (!affilaiteWhitelistDisabled) {
    const affilaiteAllowed = await marketplace.methods
      .allowedAffiliates(data.affiliate)
      .call()

    if (!affilaiteAllowed) {
      throw new Error('Affiliate not on whitelist')
    }
  }

  const ipfsHash = await post(context.contracts.ipfsRPC, { ...data, buyer })
  const commission = web3.utils.toWei(data.commission, 'ether')

  const args = [
    data.listingID,
    ipfsHash,
    data.finalizes,
    data.affiliate,
    commission,
    data.value,
    data.currency,
    data.arbitrator
  ]
  if (data.withdraw) {
    args.push(data.withdraw)
  }

  const tx = marketplace.methods.makeOffer(...args).send({
    gas: 4612388,
    from: buyer,
    value: data.value
  })
  return txHelper({
    tx,
    context,
    mutation: 'makeOffer'
  })
}

export default makeOffer

/*
mutation makeOffer(
  $listingID: String,
  $finalizes: String,
  $affiliate: String,
  $commission: String,
  $value: String,
  $currency: String,
  $arbitrator: String
) {
  makeOffer(
    listingID: $listingID,
    finalizes: $finalizes,
    affiliate: $affiliate,
    commission: $commission,
    value: $value,
    currency: $currency,
    arbitrator: $arbitrator
  )
}
{
  "listingID": "0",
  "finalizes": "1536300000",
  "affiliate": "0x7c38A2934323aAa8dAda876Cfc147C8af40F8D0e",
  "commission": "0",
  "value": "100000000000000000",
  "currency": "0x0000000000000000000000000000000000000000",
  "arbitrator": "0x7c38A2934323aAa8dAda876Cfc147C8af40F8D0e"
}
*/
