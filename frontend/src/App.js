import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";
// import { IndexLinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "./lib/errorLib";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  
  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    history.push("/login");
  }
  
  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          {/* <LinkContainer to="/"> */}
          <Nav.Link as={Link} to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              Scratch
            </Navbar.Brand>
          </Nav.Link>
          {/* </LinkContainer> */}
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/settings">
                    Settings
                  
                </Nav.Link>
                <Nav.Link  onClick={handleLogout} >
                  Logout
                </Nav.Link>
              </>
              ) : (
                <>
                  {/* <LinkContainer to="/signup"> */}
                  <Nav.Link as={Link} to="/signup">
                    Signup
                    </Nav.Link>
                  {/* </LinkContainer> */}
                  {/* <LinkContainer to="/login"> */}
                  <Nav.Link as={Link} to="/login">
                    Login
                    </Nav.Link>
                  {/* </LinkContainer> */}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
  <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
    <Routes />
  </AppContext.Provider>
</ErrorBoundary>
      </div>
    )
  );
              }
export default App;
