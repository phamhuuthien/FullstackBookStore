import { useState } from "react";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";
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
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>email</td>
              <td>
                <input type="email" name="email" onChange={handleOnChange} />
              </td>
            </tr>
            <tr>
              <td>password</td>
              <td>
                <input
                  type="password"
                  name="password"
                  onChange={handleOnChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <input type="submit" value="Login" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

export default Login;
