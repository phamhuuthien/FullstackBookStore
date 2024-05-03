import { logout } from "../../services/userService";
import { useNavigate } from "react-router-dom";
function Logout() {
  const navigate = useNavigate();
  const fetchApi = async () => {
    const respone = await logout();
    if (respone.success) {
      console.log(respone);
      navigate("/");
    }
  };
  fetchApi();
  return <></>;
}

export default Logout;
