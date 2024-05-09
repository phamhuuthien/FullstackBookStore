import { useState } from "react";
import { register } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "./register.css";
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
      <div className="register-container">
        <div className="content">
          <div class="bt-form-login-simple-1">
            <h1 class="form-heading">register</h1>
            <form class="form" autocomplete="off" onSubmit={handleSubmit}>
              <div class="form-group">
                <label for="firstname">first name *</label>
                <input
                  type="text"
                  name="firstname"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-group">
                <label for="lastname">last name *</label>
                <input
                  type="text"
                  name="lastname"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-group">
                <label for="email">email *</label>
                <input
                  type="email"
                  name="email"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-group">
                <label for="password">password *</label>
                <input
                  type="password"
                  name="password"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <div class="form-group">
                <label for="mobile">mobile *</label>
                <input
                  type="text"
                  name="mobile"
                  class="form-input"
                  onChange={handleOnChange}
                />
              </div>
              <button type="submit" class="form-btn">
                register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
