import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const MakeOfferMutation = gql`
  mutation MakeOffer($listingID: String!, $value: String!) {
    makeOffer(listingID: $listingID, value: $value) {
      id
    }
  }
`;

class Buy extends Component {
  render() {
    const { id, ipfs: { price } } = this.props.listing;
    const value = web3.utils.toWei(String(price.amount), "ether");
    const variables = { listingID: String(id), value };

    return (
      <Mutation mutation={MakeOfferMutation}>
        {(makeOffer, { error }) => {
          if (error) alert(error.message)
          return (
            <button onClick={() => makeOffer({ variables })}>Buy</button>
          )
        }}
      </Mutation>
    );
  }
}

export default Buy;
