import "./App.css";
import { Route, Switch } from "wouter";
import Navbar from "./components/Nav";
import Landing from "./pages/Landing";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar></Navbar>
      <Switch>
        <Route path="/" component={Landing} />

        <Route path="/users/:name">
          {(params) => <>Hello, {params.name}!</>}
        </Route>

        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
      <Footer></Footer>
    </>
  );
}
