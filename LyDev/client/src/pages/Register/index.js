import { useState } from "react";
import { register } from "../../services/userService";
import { useNavigate } from "react-router-dom";
function Register() {
  const [data, setData] = useState({ role: "65f91a825a5aefc10dd60544" });
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
    const result = await register(data);
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
              <td>firstName</td>
              <td>
                <input type="text" name="firstname" onChange={handleOnChange} />
              </td>
            </tr>
            <tr>
              <td>lastName</td>
              <td>
                <input type="text" name="lastname" onChange={handleOnChange} />
              </td>
            </tr>
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
              <td>mobile</td>
              <td>
                <input type="text" name="mobile" onChange={handleOnChange} />
              </td>
            </tr>
            <tr>
              <td>
                <input type="submit" value="register" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
}

export default Register;
