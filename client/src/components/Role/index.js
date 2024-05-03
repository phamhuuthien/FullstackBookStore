import CreateRole from "./CreateRole";
import RoleList from "./RoleList";
import { useState } from "react";

function Role() {
  const [reload, setReload] = useState(true);

  const handleReload = () => {
    setReload(!reload);
  };
  return (
    <>
      <CreateRole onReload={handleReload} />
      <RoleList reload={reload} />
    </>
  );
}

export default Role;
