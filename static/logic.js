/* global DCLib */
DCLib.defineDAppLogic('dice_dev', function (payChannel) {
  const MAX_RAND_NUM = 65535
  const HOUSEEDGE    = 0.02 // 2%

  let history = []

  var Roll = function (userBet, userNum, random_hash) {
    // convert 1BET to 100000000
    userBet = DCLib.Utils.bet2dec(userBet)
    // generate random number

    const randomNum = DCLib.numFromHash(random_hash, 0, MAX_RAND_NUM)

    let profit = -userBet
    // if user win
    if (userNum >= randomNum) {
      profit = (userBet * (MAX_RAND_NUM - MAX_RAND_NUM * HOUSEEDGE) / userNum) - userBet
    }
    // add result to paychannel
    payChannel.addTX(profit)
    payChannel.printLog()

    // push all data to our log
    // just for debug
    const rollItem = {
      timestamp   : new Date().getTime(),
      user_bet    : userBet,
      profit      : profit,
      user_num    : userNum,
      balance     : payChannel.getBalance(),
      random_hash : random_hash,
      random_num  : randomNum
    }
    history.push(rollItem)

    return rollItem
  }

  return {
    Game: Roll,
    history: history
  }
})
