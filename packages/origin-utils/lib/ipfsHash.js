// export function getBytes32FromIpfsHash(hash) {
//   return hash;
// }
// export function getIpfsHashFromBytes32(bytes32Hex) {
//   return bytes32Hex;
// }
import bs58 from 'bs58'

export function getBytes32FromIpfsHash(hash) {
  return `0x${bs58
    .decode(hash)
    .slice(2)
    .toString('hex')}`
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
export function getIpfsHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = '1220' + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

export async function post(gateway, json) {
  var formData = new FormData()
  formData.append('file', new Blob([JSON.stringify(json)]))

  var rawRes = await fetch(`${gateway}/api/v0/add`, {
    method: 'POST',
    body: formData
  })
  var res = await rawRes.json()

  return getBytes32FromIpfsHash(res.Hash)
}

export async function postEnc(gateway, json, pubKeys) {
  var formData = new FormData()

  var publicKeys = pubKeys.reduce(
    (acc, val) => acc.concat(openpgp.key.readArmored(val).keys),
    []
  )

  var encrypted = await openpgp.encrypt({
    data: JSON.stringify(json),
    publicKeys
  })

  formData.append('file', new Blob([encrypted.data]))

  var rawRes = await fetch(`${gateway}/api/v0/add`, {
    method: 'POST',
    body: formData
  })
  var res = await rawRes.json()

  return getBytes32FromIpfsHash(res.Hash)
}

export async function decode(text, key, pass) {
  const privKeyObj = openpgp.key.readArmored(key).keys[0]
  await privKeyObj.decrypt(pass)

  const decrypted = await openpgp.decrypt({
    message: openpgp.message.readArmored(text),
    privateKeys: [privKeyObj]
  })
  return decrypted.data
}

export async function getText(gateway, hashAsBytes) {
  var hash = getIpfsHashFromBytes32(hashAsBytes)
  const response = await new Promise(resolve => {
    let didTimeOut = false
    const timeout = setTimeout(() => {
      didTimeOut = true
      resolve()
    }, 10000)
    fetch(`${gateway}/ipfs/${hash}`)
      .then(response => {
        clearTimeout(timeout)
        if (!didTimeOut) {
          resolve(response)
        }
      })
      .catch(() => {
        clearTimeout(timeout)
        if (!didTimeOut) {
          resolve(null)
        }
      })
  })
  if (!response) {
    return '{}'
  }
  return await response.text()
}

export async function get(gateway, hashAsBytes, party) {
  let text = await getText(gateway, hashAsBytes)
  if (text.indexOf('-----BEGIN PGP MESSAGE-----') === 0 && party) {
    try {
      text = await decode(text, party.privateKey, party.pgpPass)
    } catch (e) {
      return { encrypted: true, decryptError: e }
    }
  }
  return JSON.parse(text)
}
