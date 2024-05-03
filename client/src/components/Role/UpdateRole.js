import Modal from "react-modal";
import { useState } from "react";
import { updateRole } from "../../services/roleService";
import Swal from "sweetalert2";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function UpdateRole(props) {
  const [showMopdal, setShowModal] = useState(false);

  const { onReload, item } = props;
  const [data, setData] = useState({ id: item._id });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOnChange = (e) => {
    const roleName = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [roleName]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateRole(data);
    if (result.success === true) {
      closeModal();
      onReload();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: result.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: result.message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <>
      <div>
        <button onClick={openModal}>edit</button>
        <Modal
          isOpen={showMopdal}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>roleName</td>
                  <td>
                    <input
                      type="text"
                      name="roleName"
                      onChange={handleOnChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button onClick={closeModal}>cancle</button>
                  </td>
                  <td>
                    <input type="submit" value="update" />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default UpdateRole;
