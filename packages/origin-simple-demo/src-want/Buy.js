import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const MakeOfferMutation = gql`
  mutation MakeOffer($listingID: String!, $value: String!) {
    makeOffer(listingID: $listingID, value: $value)
  }
`;

const Buy = (props) => {
    const variables = {
      listingID: this.props.listing.id,
      value: web3.utils.toWei(this.props.listing.price, "ether")
    };

    return (
      <Mutation mutation={MakeOfferMutation}>
        {makeOffer => (
          <button onClick={() => makeOffer({ variables })}>Buy</button>
        )}
      </Mutation>
    );
  }

export default Buy;
