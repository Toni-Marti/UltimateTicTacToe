import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    return(
        
        <nav>
        <p>Debugging:</p>
      <ul>
        <li><Link to="/Game">GameR</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Lobby">Lobby</Link></li>
        <li><Link to="/SignUp">SignUp</Link></li>
        <li><Link to="/TestPage">TestPage</Link></li>
      </ul>
    </nav>
    );
}

export default Nav;