
import { getAllData, createDataItem, updateDataItem, deleteDataItem } from "./api.js";
import { renderAdminList } from "./ui.js";

export function createAdminPage(config) {
  const form = document.getElementById(config.formId);
  const list = document.getElementById(config.listId);
  const editIdInput = document.getElementById(config.idField);
  const cancelBtn = document.getElementById(config.cancelBtnId);
  const endpoint = config.endpoint;

  let items = [];

  const clearForm = () => {
    form.reset();
    editIdInput.value = "";
    if (cancelBtn) {
      cancelBtn.style.display = "none";
    }
  };

  const loadItems = async () => {
    items = await getAllData(endpoint);
    renderAdminList(list, items, config.itemDisplayName);
  };

  form.onsubmit = async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const id = formData.id;

    try {
      if (id) {
        await updateDataItem(endpoint, id, formData);
        alert(`${config.itemDisplayName} diperbarui!`);
      } else {
        await createDataItem(endpoint, formData);
        alert(`${config.itemDisplayName} ditambahkan!`);
      }
      
      clearForm();
      loadItems();
    } catch (error) {
      console.error(`Error saving ${config.itemDisplayName}:`, error);
      alert(`Gagal menyimpan ${config.itemDisplayName}.`);
    }
  };

  list.addEventListener("click", async e => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("del-btn")) {
      if (confirm(`Yakin ingin menghapus ${config.itemDisplayName} ini?`)) {
        try {
          await deleteDataItem(endpoint, id);
          alert(`${config.itemDisplayName} dihapus`);
          loadItems();
        } catch (error) {
          console.error(`Error deleting ${config.itemDisplayName}:`, error);
          alert(`Gagal menghapus ${config.itemDisplayName}.`);
        }
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const itemToEdit = items.find(item => item.id == id);
      if (itemToEdit) {
        for (const key in itemToEdit) {
          if (form[key]) {
            form[key].value = itemToEdit[key];
          }
        }
        editIdInput.value = itemToEdit.id;
        if (cancelBtn) {
          cancelBtn.style.display = "inline-block";
        }
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  if (cancelBtn) {
    cancelBtn.onclick = clearForm;
  }

  loadItems();
}
