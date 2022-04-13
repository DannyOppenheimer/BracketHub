import React from 'react'
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className='container'>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bracket-builder">Create Bracket</NavLink>
        <NavLink to="/join-bracket">Join Bracket Group</NavLink>
        <NavLink to="/bracket-groups">My Bracket Groups</NavLink>
        <NavLink to="/explore">Explore</NavLink>
    </div>
  )
}

export default Navigation
