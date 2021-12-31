import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import Market from './Pages/Market';
import CreateToken from './Pages/CreateToken';
import Navbar from './Components/Navbar';
import { Route, Switch } from 'react-router-dom';
import MyTokens from './Pages/MyTokens';
import { useState } from 'react';

function App() {
  const { ethereum } = window;
  const [addr, setAddr] = useState(ethereum?.selectedAddress)

  if (!ethereum) {
    return (
      <div className="App">
        Please Connect your Ethereum Wallet
      </div>
    )
  }

  ethereum.on('accountsChanged', (accounts) => {
    setAddr(accounts[0]);
  })

  return (
    <div className="App">
      <Navbar addr={addr} />
      <Switch>
        <Route path="/" render={() => <Market addr={addr} />} exact />
        <Route path="/mint" component={CreateToken} />
        <Route path="/my-tokens" render={() => <MyTokens addr={addr} />} />
      </Switch>
    </div>
  )
}

export default App;
