import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Buy from "./Buy";

const query = gql`
  {
    listings {
      id
      title
      price
      currency
    }
  }
`;

const Listings = () => (
  <Query query={query}>
    {({ loading, data }) =>
      loading ? (
        "Loading..."
      ) : (
        <table>
          <tbody>
            {data.listings.map(({ id, title, price, currency }) => (
              <tr key={id}>
                <td>{`${id}. ${title}`}</td>
                <td>{`${price} ${currency}`}</td>
                <td>
                  <Buy listing={{ id, price }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
  </Query>
);

export default Listings;
