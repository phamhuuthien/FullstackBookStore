import { useState } from "react";
import { login } from "../../services/userService";
import { useNavigate, NavLink } from "react-router-dom";
import "./login.css";
function Login() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(data);
    if (result.success) {
      navigate("/");
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="content">
          <div class="bt-form-login-simple-1">
            <h1 class="form-heading">Login</h1>
            <form class="form" autocomplete="off" onSubmit={handleSubmit}>
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  name="email"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-group">
                <label for="password">Password *</label>
                <input
                  type="password"
                  name="password"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-meta">
                <NavLink to="/forgot-password"> Forgot Password</NavLink>
              </div>
              <button type="submit" class="form-btn">
                Login
              </button>
            </form>
            <div class="form-option">
              Dont&#x27;t have am account?
              <NavLink to="#">Sign up for free</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <form onSubmit={handleSubmit}>
  //       <table>
  //         <tbody>
  //           <tr>
  //             <td>email</td>
  //             <td>
  //               <input type="email" name="email" onChange={handleOnChange} />
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>password</td>
  //             <td>
  //               <input
  //                 type="password"
  //                 name="password"
  //                 onChange={handleOnChange}
  //               />
  //             </td>
  //           </tr>
  //           <tr>
  //             <td>
  //               <input type="submit" value="Login" />
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </form>
  //   </>
  // );
}

export default Login;
