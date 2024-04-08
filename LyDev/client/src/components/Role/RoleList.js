import { useEffect, useState } from "react";
import { getAllRole } from "../../services/roleService";
import UpdateRole from "./UpdateRole";
import DeleteRole from "./DeleteRole";
function RoleList(props) {
  const [data, setData] = useState([]);
  const { reload } = props;

  const [updateReload, setUpdateReload] = useState(true);

  const handleReload = () => {
    setUpdateReload(!updateReload);
  };

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getAllRole();
      setData(result.data);
    };
    fetchApi();
  }, [reload, updateReload]);

  return (
    <>
      <h1>danh sach cac role</h1>
      <ul className="role__list">
        {data &&
          data.map((role) => (
            <li className="role__item" key={role._id}>
              {role.roleName}
              <UpdateRole item={role} onReload={handleReload} />
              <DeleteRole item={role} onReload={handleReload} />
            </li>
          ))}
      </ul>
    </>
  );
}

export default RoleList;
