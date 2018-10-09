import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Buy from "./Buy";

const ListingsQuery = gql`
  {
    web3 {
      metaMaskEnabled
      metaMaskNetwork
    }
    marketplace {
      allListings {
        id
        ipfs {
          title
          price {
            amount
            currency
          }
        }
      }
    }
  }
`;

const Listings = () => (
  <Query query={ListingsQuery}>
    {({ loading, data }) => {
      if (loading) return "Loading..."
      if (!data || !data.web3.metaMaskEnabled) return "Please enable MetaMask"
      if (data.web3.metaMaskNetwork !== "1") return "Please set MetaMask to Mainnet"
      return (
        <div>
          <h2>Origin Listings</h2>
          <table>
            <tbody>
              {data.marketplace.allListings.map(({ id, ipfs }) => (
                <tr key={id}>
                  <td>{`${id}. ${ipfs.title}`}</td>
                  <td>{`${ipfs.price.amount} ${ipfs.price.currency}`}</td>
                  <td>
                    <Buy listing={{ id, ipfs }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }}
  </Query>
);

export default Listings;
