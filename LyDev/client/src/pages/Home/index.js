import { NavLink } from "react-router-dom";
function Home() {
  return (
    <>
      <h1>Home</h1>
      <ul>
        <li>
          <NavLink to="/login">login</NavLink>
        </li>
        <li>
          <NavLink to="/register">register</NavLink>
        </li>
        <li>
          <NavLink to="/logout">logout</NavLink>
        </li>
      </ul>
    </>
  );
}

export default Home;
