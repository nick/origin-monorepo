import balancesFromWei from 'origin-utils/lib/balancesFromWei'

export default (_, { address }, context) => {
  web3.eth.defaultAccount = window.localStorage.defaultAccount = address
  return {
    id: address,
    balance: balancesFromWei(address, context)
  }
}
