import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    return(
        
        <nav>
        <p>Debugging:</p>
      <ul>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Lobby">Lobby</Link></li>
        <li><Link to="/SignUp">SignUp</Link></li>
        <br/>
        Temporal links:
        <li><Link to="/Game">GameR</Link></li>
        <li><Link to="/GamePage">GamePage</Link></li>
        <li><Link to="/TestPage">TestPage</Link></li>
        <li><Link to="/Chat">GeneralChat</Link></li>
      </ul>
      <hr/>
    </nav>
    );
}

export default Nav;