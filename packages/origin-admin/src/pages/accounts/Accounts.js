import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { Button } from '@blueprintjs/core'

// import { resetContracts } from '../../graphql/context'
import NodeAccounts from './_NodeAccounts'
import WalletAccounts from './_WalletAccounts'
import CreateWallet from './_CreateWallet'

import {
  CreateWalletMutation,
  DeployTokenMutation,
  SendFromNodeMutation,
  TransferTokenMutation,
  DeployMarketplaceMutation,
  UpdateTokenAllowanceMutation,
  AddAffiliateMutation
} from '../../mutations'

import query from './_query'

const TransactionSubscription = gql`
  subscription onTransactionUpdated {
    transactionUpdated {
      id
      status
      mutation
      confirmations
    }
  }
`

import gqlClient from '../../graphqlClient'

function transactionConfirmed(hash) {
  return new Promise(resolve => {
    const sub = gqlClient
      .subscribe({
        query: TransactionSubscription
      })
      .subscribe({
        next: async result => {
          const t = result.data.transactionUpdated
          if (t.id === hash && t.status === 'receipt') {
            sub.unsubscribe()
            const result = await web3.eth.getTransactionReceipt(hash)
            resolve(result)
          }
        }
      })
  })
}

async function populate(NodeAccount) {
  let hash

  const Admin = (await gqlClient.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Admin', name: 'Admin' }
  })).data.createWallet.id
  console.log('Created Admin')

  hash = (await gqlClient.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Admin, from: NodeAccount, value: '0.5' }
  })).data.sendFromNode.id
  await transactionConfirmed(hash)
  console.log('Sent eth to Admin')

  hash = (await gqlClient.mutate({
    mutation: DeployTokenMutation,
    variables: {
      name: 'Origin Token',
      symbol: 'OGN',
      decimals: '18',
      supply: '1000000000'
    }
  })).data.deployToken.id
  const OGN = (await transactionConfirmed(hash)).contractAddress
  console.log('Deployed token')

  hash = (await gqlClient.mutate({
    mutation: DeployMarketplaceMutation,
    variables: { token: OGN, version: '001', autoWhitelist: true }
  })).data.deployMarketplace.id
  const Marketplace = (await transactionConfirmed(hash)).contractAddress
  console.log('Deployed marketplace')

  const Seller = (await gqlClient.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Seller', name: 'Stan' }
  })).data.createWallet.id
  console.log('Created seller wallet')

  hash = (await gqlClient.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Seller, from: NodeAccount, value: '0.5' }
  })).data.sendFromNode.id
  await transactionConfirmed(hash)
  console.log('Sent eth to seller')

  hash = (await gqlClient.mutate({
    mutation: TransferTokenMutation,
    variables: { token: 'ogn', to: Seller, from: Admin, value: '500' }
  })).data.transferToken.id
  await transactionConfirmed(hash)
  console.log('Sent ogn to seller')

  hash = (await gqlClient.mutate({
    mutation: UpdateTokenAllowanceMutation,
    variables: { token: 'ogn', to: Marketplace, from: Seller, value: '500' }
  })).data.updateTokenAllowance.id
  await transactionConfirmed(hash)
  console.log('Set seller token allowance')

  const Buyer = (await gqlClient.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Buyer', name: 'Nick' }
  })).data.createWallet.id
  console.log('Created buyer')

  hash = (await gqlClient.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Buyer, from: NodeAccount, value: '0.5' }
  })).data.sendFromNode.id
  await transactionConfirmed(hash)
  console.log('Sent eth to buyer')

  const Arbitrator = (await gqlClient.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Arbitrator', name: 'Origin' }
  })).data.createWallet.id
  console.log('Created arbitrator')

  hash = (await gqlClient.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Arbitrator, from: NodeAccount, value: '0.5' }
  })).data.sendFromNode.id
  await transactionConfirmed(hash)
  console.log('Sent eth to arbitrator')

  const Affiliate = (await gqlClient.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Affiliate', name: 'Origin' }
  })).data.createWallet.id
  console.log('Created affiliate')

  hash = (await gqlClient.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Affiliate, from: NodeAccount, value: '0.1' }
  })).data.sendFromNode.id
  await transactionConfirmed(hash)
  console.log('Sent eth to affiliate')

  hash = (await gqlClient.mutate({
    mutation: AddAffiliateMutation,
    variables: { affiliate: Affiliate, from: Admin }
  })).data.addAffiliate.id
  await transactionConfirmed(hash)
  console.log('Added affiliate to marketplace')
}

const SetNetworkMutation = gql`
  mutation SetNetwork($network: String) {
    setNetwork(network: $network)
  }
`

class Accounts extends Component {
  render() {
    return (
      <Query query={query} notifyOnNetworkStatusChange={true}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <p className="mt-3">Loading...</p>
          if (error) {
            console.log(error)
            return <p className="mt-3">Error :(</p>
          }
          if (!data || !data.web3) {
            return null
          }

          const maxNodeAccount = [...data.web3.nodeAccounts].sort((a, b) => {
            if (Number(a.balance.eth) > Number(b.balance.eth)) return -1
            if (Number(a.balance.eth) < Number(b.balance.eth)) return 1
            return 0
          })[0]

          // if (data.web3.metaMaskAccount) {
          //   data.web3.accounts.push(data.web3.metaMaskAccount)
          // }

          return (
            <div className="p-3">
              <CreateWallet />
              <WalletAccounts
                data={data.web3}
                maxNodeAccount={maxNodeAccount ? maxNodeAccount.id : null}
              />
              <NodeAccounts data={data.web3.nodeAccounts} />
              <Mutation mutation={SetNetworkMutation}>
                {(setNetwork, { client }) => (
                  <Button
                    style={{ marginTop: '1rem' }}
                    intent="danger"
                    onClick={async () => {
                      localStorage.clear()
                      web3.eth.accounts.wallet.clear()
                      setNetwork({ variables: { network: 'localhost' } })
                      await client.resetStore()
                    }}
                    text="Reset"
                  />
                )}
              </Mutation>
              <Button
                style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
                intent="success"
                onClick={() =>
                  populate(maxNodeAccount ? maxNodeAccount.id : null)
                }
                text="Populate"
              />
              <Button
                style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
                icon="refresh"
                onClick={() => refetch()}
              />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Accounts
