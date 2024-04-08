import Modal from "react-modal";
import { useState } from "react";
import { createRole } from "../../services/roleService";
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

function CreateRole(props) {
  const [showMopdal, setShowModal] = useState(false);
  const [data, setData] = useState({});

  const { onReload } = props;

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
    const result = await createRole(data);
    console.log(result);
    if (result.success === true) {
      closeModal();
      onReload();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
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
        <button onClick={openModal}>+ add role</button>
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
                    <input type="submit" value="add" />
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

export default CreateRole;
