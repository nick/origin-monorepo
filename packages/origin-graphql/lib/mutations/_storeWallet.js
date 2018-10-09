function storeWallet({ id, name, role, privateKey }) {
  let privateKeys = [],
    roles = {},
    names = {}
  try {
    privateKeys = JSON.parse(window.localStorage.privateKeys)
  } catch (e) {
    /* Ignore */
  }
  try {
    roles = JSON.parse(window.localStorage.accountRoles)
  } catch (e) {
    /* Ignore */
  }
  try {
    names = JSON.parse(window.localStorage.accountNames)
  } catch (e) {
    /* Ignore */
  }
  window.localStorage.privateKeys = JSON.stringify([...privateKeys, privateKey])
  window.localStorage.accountRoles = JSON.stringify({
    ...roles,
    [id]: role
  })
  window.localStorage.accountNames = JSON.stringify({
    ...names,
    [id]: name
  })
  web3.eth.defaultAccount = window.localStorage.defaultAccount = id
}

export default storeWallet
