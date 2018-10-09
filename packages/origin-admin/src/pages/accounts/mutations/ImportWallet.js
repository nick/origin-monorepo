import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import withAccounts from '../../marketplace/hoc/withAccounts'

import {
  Button,
  Dialog,
  FormGroup,
  InputGroup,
  HTMLSelect
} from '@blueprintjs/core'

import { ImportWalletMutation } from '../../../mutations'
import ErrorCallout from 'components/ErrorCallout'

class SendFromWallet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Nick',
      role: 'Buyer',
      privateKey: ''
    }
  }

  render() {
    const input = field => ({
      value: this.state[field],
      onChange: e => this.setState({ [field]: e.currentTarget.value })
    })
    return (
      <Mutation
        mutation={ImportWalletMutation}
        onCompleted={this.props.onCompleted}
        refetchQueries={['AllAccounts']}
      >
        {(importWallet, { loading, error }) => (
          <Dialog
            title="Import Wallet"
            isOpen={this.props.isOpen}
            onClose={this.props.onCompleted}
            refetchQueries={['AllAccounts']}
          >
            <div className="bp3-dialog-body">
              <ErrorCallout error={error} />
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: 20 }}>
                  <FormGroup label="Name">
                    <InputGroup {...input('name')} />
                  </FormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  <FormGroup label="Role">
                    <HTMLSelect
                      options={[
                        'Buyer',
                        'Seller',
                        'Arbitrator',
                        'Affiliate',
                        'Admin'
                      ]}
                      {...input('role')}
                    />
                  </FormGroup>
                </div>
              </div>
              <FormGroup label="Private Key">
                <InputGroup {...input('privateKey')} />
              </FormGroup>
            </div>
            <div className="bp3-dialog-footer">
              <div className="bp3-dialog-footer-actions">
                <Button
                  text="Import"
                  intent="primary"
                  loading={loading}
                  onClick={() => importWallet({ variables: this.state })}
                />
              </div>
            </div>
          </Dialog>
        )}
      </Mutation>
    )
  }
}

export default withAccounts(SendFromWallet)
