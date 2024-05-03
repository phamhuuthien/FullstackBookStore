import Swal from "sweetalert2";
import { deleteRole } from "../../services/roleService";
function DeleteRole(props) {
  const { item, onReload } = props;

  const deleteItem = async (item) => {
    const result = await deleteRole(item);
    if (result) {
      onReload();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "bạn chắc chắn muốn xóa?",
      text: "bạn sẽ không phục lại được khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "chắc chắn",
      cancelButtonText: "hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(item);
      }
    });
  };
  return (
    <>
      <button onClick={handleDelete}>delete</button>
    </>
  );
}

export default DeleteRole;
