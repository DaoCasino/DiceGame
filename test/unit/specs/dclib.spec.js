import DC from '@/model/DCLib'

describe('DCLib', () => {
  it('get contract', async () => {
    await DC.getGameContract(res => {
      (res)
        ? expect(res.address).to.be.equal('0xf05f97e5770d9cc5d8af89c88e8c4ea840f987d2')
        : expect(res).to.be.equal(false)
    })
  })

  it('Get balance', async () => {
    const balance      = await DC.getBalance()
    const checkPropETH = balance.hasOwnProperty('eth')
    const checkPropBET = balance.hasOwnProperty('bets')
    expect(checkPropETH).to.be.equal(true)
    expect(checkPropBET).to.be.equal(true)
  })
})
