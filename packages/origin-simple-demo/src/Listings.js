import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Buy from "./Buy";

const ListingsQuery = gql`
  {
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
    {({ loading, data }) => (
      <div>
        <h2>Origin Listings</h2>
        {loading ? (
          "Loading..."
        ) : (
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
        )}
      </div>
    )}
  </Query>
);

export default Listings;
