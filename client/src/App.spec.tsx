import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

describe(`<App/>`, function() {
  describe('create function', function() {
    it('should create new account successfully', function() {
      render(<App/>)
      const accountType = 'Client test checking'
      const initialDeposit = 1234
      const accountTypeInput = screen.getByLabelText('Account Type')
      const initialDepositInput = screen.getByLabelText('Initial Deposit')
      const createAccountButon = screen.getByRole('button')
      
      fireEvent.change(accountTypeInput, {target: {value: accountType}})
      fireEvent.change(initialDepositInput, {target: {value: initialDeposit}})
      fireEvent.click(createAccountButon)

      expect(screen.getByLabelText('Account Type')).toBeInTheDocument()
    })
  })

  it('should do something with the mock', async function() {
    mock.onGet('/accounts').reply(200, {account: 1})

    const response = await axios.get('/accounts')

    expect(response.status).toEqual(200)
    expect(response.data?.account).toEqual(1)
  })
})
