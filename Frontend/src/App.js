import './App.css';
import { useState } from 'react';
import { Route, Switch, Link, useHistory } from 'react-router-dom';
import Auth from './components/Auth';
import Todos from './components/Todos';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  toast.configure();
  const history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function logout() {
    setIsAuthenticated(false);
    window.localStorage.removeItem('token');
    history.push('/signin');
  }

  return (
    <div className="App">
      <header>
        <div className="left">
          <Link to='/'>
            Todos
          </Link>
        </div>
        <div className="right">
          {
            isAuthenticated ?
            <>
              <div className="logout"
                onClick={() => logout()}
              >
                Logout
              </div>
            </>
            :
            <>
              <Link className="bt_signin" to='/signin'>
                Sign In
              </Link>
              <Link className="bt_signup" to='/signup'>
                Sign Up
              </Link>
            </>
          }
        </div>
      </header>

      <Switch>
        <Route path='/signin' exact>
          <Auth
            type="signin"
            setIsAuthenticated={setIsAuthenticated}
          />
        </Route>
        <Route path='/signup' exact>
          <Auth
            type="signup"
            setIsAuthenticated={setIsAuthenticated}
          />
        </Route>
        <Route path='/' exact>
          <Todos
            setIsAuthenticated={setIsAuthenticated}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
