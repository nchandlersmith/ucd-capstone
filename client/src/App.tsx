import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { Form } from 'react-bootstrap';

function App() {
  const [accountType, setAccountType] = useState('')
  const [initialDeposit, setInitialDeposit] = useState(0)
  
  return (
    <div>
      <Form>
        <Form.Group controlId='accountType'>
          <Form.Label>Account Type</Form.Label>
          <Form.Control 
            type='text'
            placeholder='account type' 
            onChange={(event) => setAccountType(event.currentTarget.value)}/>
          <Form.Text>Enter account type.</Form.Text>
        </Form.Group>
        <Form.Group controlId='initialDeposit'>
          <Form.Label>Initial Deposit</Form.Label>
          <Form.Control
            type='text'
            placeholder='0'
            onChange={(event) => setInitialDeposit(parseFloat(event.currentTarget.value))}/>
          <Form.Text>Enter initial depsoit in dollars.</Form.Text>
        </Form.Group>
        <Button variant='primary' type='reset' onClick={post}>
          Submit
        </Button>
      </Form>
    </div>
  )

async function post() {
  const url = 'https://a6gx2186x5.execute-api.us-east-1.amazonaws.com/dev/accounts'
  console.log(url)
  const data = {
    accountType,
    initialDeposit
  }
  axios.post(url, data)
  .then(response => {
    console.log(`response: JSON.stringify(response)`)
  })
  .catch(error => {
    console.error(`error: JSON.stringify(error)`)
  })
}
}

export default App;
