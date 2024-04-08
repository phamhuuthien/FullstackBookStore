import { useEffect, useState } from "react";
import { editUser } from "../../services/userService";

function User() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await editUser({ firstname: "user1" });
        setUser(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  console.log(user);
  return (
    <>
      <h1>User Information</h1>
      <p>First Name: {user.firstname}</p>
      {/* Render other user data as needed */}
    </>
  );
}

export default User;
