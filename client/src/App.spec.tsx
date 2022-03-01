import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const axiosMock = new MockAdapter(axios)

describe("getAllPhotos", () => {
  // TODO: fix this test
  it('should do something with the mock', async function() {
    axiosMock.onGet('/accounts').reply(200, {account: 1})

    const response = await axios.get('/accounts')

    expect(response.status).toEqual(200)
    expect(response.data?.account).toEqual(1)
  })
})

