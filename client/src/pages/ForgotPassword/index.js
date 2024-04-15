import { forgotPassword } from "../../services/userService";
import { useState } from "react";
function ForgotPassword() {
  const [data, setData] = useState({});
  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(data.email);
    if (result.success) {
      // lam cai chi
      console.log("hello");
    }
  };
  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            name="email"
            class="form-input"
            onChange={handleOnChange}
          />
          <button type="submit" class="form-btn">
            send
          </button>
        </div>
      </form>
    </>
  );
}

export default ForgotPassword;
