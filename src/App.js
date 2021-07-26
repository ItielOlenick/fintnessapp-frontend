import './App.css';
import UsersList from './components/UsersList';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NoteFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path = "/" component={UsersList} />
          <Route path="*" component={NoteFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
