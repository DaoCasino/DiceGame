<page-head>
  <script></script>

  <header class="header">
    <div class="logo">
      <a class="logo-link" href="#">
        <img class="logo-img" src="/static/img/logo.png" alt="Dao Casino"/>
      </a>
    </div>

    <div class="switch">
      <form class="switch-form">
        <label class="switch-label">
          <input class="switch-input switch-testnet" type="radio" name="switch_network" checked />
          <span class="switch-text">testnet</span>
        </label>
        <div class="switch-but">
          <a class="switch-shadow" href="#"></a>
        </div>
        <label class="switch-label">
          <input class="switch-input switch-mainnet" type="radio" name="switch_network" />
          <span class="switch-text">mainnet</span>
        </label>
      </form>
    </div>

    <div class="account">
      <a class="account-page" href="#">.:.:. bets</a>
    </div>
  </header>

  <style type="less">
    
    .header {
      position: relative;
      margin: 30px 0;
      display: flex;
      width: 100%;
      height: 20px;
    }

    .switch {
      position: absolute;
      right: 0;
      justify-content: center;
    
      &-form {
        display: flex;
      }
    
      &-label {
        display: flex;
      }

      &-text {
        position: relative;
        top: 4px;
        display: block;
      }

      &-input {
        display: none;
      }

      &-shadow {
        position: relative;
        margin: 0 15px;
        display: block;
        width: 46px;
        height: 20px;
        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          width: 36px;
          height: 3px;
        }

        &:after {
          content: '';
          position: absolute;
          top: -5px;
          left: 0;
          display: block;
          width: 10px;
          height: 10px;
        }
      }
    }

    .account {
      position: relative;
      right: 0;
      display: none;
      &-page {
        padding: 10px;
        display: block;
      }
    }
  </style>
</page-head>