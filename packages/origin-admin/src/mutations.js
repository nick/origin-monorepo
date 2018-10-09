import gql from 'graphql-tag'
// import gqlClient from './graphqlClient'

import fragments from './fragments'

export const RefetchMutation = gql`
  mutation Refetch {
    refetch
  }
`

export const AddAffiliateMutation = gql`
  mutation AddAffiliate($affiliate: String, $from: String) {
    addAffiliate(affiliate: $affiliate, from: $from) {
      id
    }
  }
`

export const CreateWalletMutation = gql`
  mutation CreateWallet($role: String, $name: String) {
    createWallet(role: $role, name: $name) {
      ...balanceFields
    }
  }
  ${fragments.Account.balance}
`

export const ImportWalletMutation = gql`
  mutation ImportWallet($role: String, $name: String, $privateKey: String!) {
    importWallet(role: $role, name: $name, privateKey: $privateKey) {
      ...balanceFields
    }
  }
  ${fragments.Account.balance}
`

export const DeployTokenMutation = gql`
  mutation DeployToken(
    $name: String
    $symbol: String
    $decimals: String
    $supply: String
  ) {
    deployToken(
      name: $name
      symbol: $symbol
      decimals: $decimals
      supply: $supply
    ) {
      id
    }
  }
`

export const SendFromNodeMutation = gql`
  mutation SendFromNode($from: String, $to: String, $value: String) {
    sendFromNode(from: $from, to: $to, value: $value) {
      id
    }
  }
`

export const SendFromWalletMutation = gql`
  mutation SendFromWallet($from: String, $to: String, $value: String) {
    sendFromWallet(from: $from, to: $to, value: $value) {
      id
    }
  }
`

export const TransferTokenMutation = gql`
  mutation TransferToken(
    $token: String!
    $from: String!
    $to: String!
    $value: String!
  ) {
    transferToken(token: $token, from: $from, to: $to, value: $value) {
      id
    }
  }
`

export const UpdateTokenAllowanceMutation = gql`
  mutation UpdateTokenAllowance(
    $token: String!
    $from: String!
    $to: String!
    $value: String!
  ) {
    updateTokenAllowance(token: $token, from: $from, to: $to, value: $value) {
      id
    }
  }
`

export const DeployMarketplaceMutation = gql`
  mutation DeployMarketplace(
    $token: String
    $version: String
    $autoWhitelist: Boolean
  ) {
    deployMarketplace(
      token: $token
      version: $version
      autoWhitelist: $autoWhitelist
    ) {
      id
    }
  }
`

export const CreateListingMutation = gql`
  mutation CreateListing(
    $deposit: String
    $arbitrator: String
    $from: String
    $data: NewListingInput
    $autoApprove: Boolean
  ) {
    createListing(
      deposit: $deposit
      arbitrator: $arbitrator
      from: $from
      data: $data
      autoApprove: $autoApprove
    ) {
      id
    }
  }
`

export const UpdateListingMutation = gql`
  mutation UpdateListing(
    $listingID: String!
    $additionalDeposit: String
    $from: String
    $data: NewListingInput
    $autoApprove: Boolean
  ) {
    updateListing(
      listingID: $listingID
      additionalDeposit: $additionalDeposit
      from: $from
      data: $data
      autoApprove: $autoApprove
    ) {
      id
    }
  }
`

export const WithdrawListingMutation = gql`
  mutation WithdrawListing(
    $listingID: String!
    $target: String!
    $reason: String
    $from: String
  ) {
    withdrawListing(
      listingID: $listingID
      target: $target
      reason: $reason
      from: $from
    ) {
      id
    }
  }
`

export const MakeOfferMutation = gql`
  mutation MakeOffer(
    $listingID: String
    $finalizes: String
    $affiliate: String
    $commission: String
    $value: String
    $currency: String
    $arbitrator: String
    $data: MakeOfferInput
    $from: String
    $withdraw: String
  ) {
    makeOffer(
      listingID: $listingID
      finalizes: $finalizes
      affiliate: $affiliate
      commission: $commission
      value: $value
      currency: $currency
      arbitrator: $arbitrator
      data: $data
      from: $from
      withdraw: $withdraw
    ) {
      id
    }
  }
`

export const AcceptOfferMutation = gql`
  mutation AcceptOffer($listingID: String!, $offerID: String!, $from: String) {
    acceptOffer(listingID: $listingID, offerID: $offerID, from: $from)
  }
`

export const AddFundsMutation = gql`
  mutation AddFunds(
    $listingID: String!
    $offerID: String!
    $amount: String!
    $from: String
  ) {
    addFunds(
      listingID: $listingID
      offerID: $offerID
      amount: $amount
      from: $from
    ) {
      id
    }
  }
`

export const UpdateRefundMutation = gql`
  mutation UpdateRefundMutation(
    $listingID: String!
    $offerID: String!
    $amount: String!
    $from: String
  ) {
    updateRefund(
      listingID: $listingID
      offerID: $offerID
      amount: $amount
      from: $from
    ) {
      id
    }
  }
`

export const ExecuteRulingMutation = gql`
  mutation ExecuteRulingMutation(
    $listingID: String!
    $offerID: String!
    $ruling: String!
    $commission: String!
    $message: String
    $refund: String
    $from: String
  ) {
    executeRuling(
      listingID: $listingID
      offerID: $offerID
      amount: $amount
      ruling: $ruling
      commission: $commission
      message: $message
      refund: $refund
      from: $from
    ) {
      id
    }
  }
`

export const FinalizeOfferMutation = gql`
  mutation FinalizeOffer($listingID: String, $offerID: String, $from: String) {
    finalizeOffer(listingID: $listingID, offerID: $offerID, from: $from) {
      id
    }
  }
`

export const DisputeOfferMutation = gql`
  mutation DisputeOffer($listingID: String, $offerID: String, $from: String) {
    disputeOffer(listingID: $listingID, offerID: $offerID, from: $from) {
      id
    }
  }
`

export const WithdrawOfferMutation = gql`
  mutation WithdrawOffer($listingID: String, $offerID: String, $from: String) {
    withdrawOffer(listingID: $listingID, offerID: $offerID, from: $from) {
      id
    }
  }
`

export const AddDataMutation = gql`
  mutation WithdrawListing(
    $data: String!
    $listingID: String
    $offerID: String
  ) {
    addData(data: $data, listingID: $listingID, offerID: $offerID) {
      id
    }
  }
`

// await originJS.createListing({
//   deposit: '2',
//   arbitrator: '0x9d42726D0Aa33984c55a1076DBc68a42f2509684',
//   from: '0x2d935875CDe9f60EE8E48e5403aD716A0A4D8e62',
//   data: {
//     title: 'Cool Bike',
//     category: 'For Sale',
//     currencyId: 'ETH',
//     price: '0.1'
//   }
// })

// window.originJS = {
//   createListing: async function(variables) {
//     return await gqlClient.mutate({
//       mutation: CreateListingMutation,
//       variables,
//       refetchQueries: ['AllListings']
//     })
//   },
//   refetch: async function(refetchQueries) {
//     return await gqlClient.mutate({
//       mutation: RefetchMutation,
//       refetchQueries
//     })
//   }
// }
