import React, { Component } from 'react'
import { Query } from 'react-apollo'

import { Button } from '@blueprintjs/core'

import Address from 'components/Address'

import gql from 'graphql-tag'

const query = gql`
  query AllContracts {
    marketplaces {
      address
      totalListings
      version
      owner {
        id
      }
    }
    tokens {
      id
      symbol
      address
      name
      decimals
      totalSupply
    }
  }
`

import DeployToken from './_DeployToken'
import DeployMarketplace from './_DeployMarketplace'
import AddAffiliate from './_AddAffiliate'

class Contracts extends Component {
  state = {}
  render() {
    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <p className="mt-3">Loading...</p>
          if (error) {
            console.log(error)
            console.log(query.loc.source.body)
            return <p className="mt-3">Error :(</p>
          }
          const marketplaces = data.marketplaces || []
          const tokens = data.tokens || []
          return (
            <div className="p-3">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <h3 className="bp3-heading">Tokens</h3>
                <Button
                  small={true}
                  icon="plus"
                  className="ml-2"
                  onClick={() => this.setState({ deployToken: true })}
                />
              </div>

              <table className="bp3-html-table bp3-small">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Decimals</th>
                    <th>Supply</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map(m => (
                    <tr key={m.id}>
                      <td>{m.symbol}</td>
                      <td>{m.name}</td>
                      <td>
                        <Address address={m.address} />
                      </td>
                      <td>{m.decimals}</td>
                      <td>{m.totalSupply}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginTop: '1.5rem'
                }}
              >
                <h3 className="bp3-heading">Marketplaces</h3>
                <Button
                  small={true}
                  icon="plus"
                  className="ml-2"
                  onClick={() => this.setState({ deployMarketplace: true })}
                />
              </div>
              <table className="bp3-html-table bp3-small">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Listings</th>
                    <th>Token</th>
                    <th>Address</th>
                    <th>Owner</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {marketplaces.map(m => (
                    <tr key={m.address}>
                      <td>{m.version}</td>
                      <td>{m.totalListings}</td>
                      <td>{m.token ? m.token.symbol : null}</td>
                      <td>
                        <Address address={m.address} />
                      </td>
                      <td>
                        <Address address={m.owner.id} />
                      </td>
                      <td>
                        <Button
                          text="Add Affiliate"
                          onClick={() =>
                            this.setState({ addAffiliate: m.owner.id })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <DeployToken
                isOpen={this.state.deployToken}
                onCompleted={() => this.setState({ deployToken: false })}
              />
              <DeployMarketplace
                isOpen={this.state.deployMarketplace}
                tokens={tokens}
                onCompleted={() => this.setState({ deployMarketplace: false })}
              />
              <AddAffiliate
                isOpen={this.state.addAffiliate ? true : false}
                from={this.state.addAffiliate}
                onCompleted={() => this.setState({ addAffiliate: false })}
              />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Contracts
