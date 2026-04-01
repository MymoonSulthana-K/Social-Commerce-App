import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminRequest } from "../../utils/adminApi";

const emptyCategory = {
  name: "",
  subcategories: [""],
};

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    const data = await adminRequest("/admin/categories");
    setCategories(data);
  };

  useEffect(() => {
    loadCategories().catch((err) =>
      setError(err.message || "Failed to load categories")
    );
  }, []);

  const resetForm = () => {
    setForm(emptyCategory);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      subcategories: form.subcategories
        .map((name) => ({ name }))
        .filter((subcategory) => subcategory.name.trim()),
    };

    try {
      if (editingId) {
        await adminRequest(`/admin/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminRequest("/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      subcategories:
        category.subcategories?.map((subcategory) => subcategory.name) || [""],
    });
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await adminRequest(`/admin/categories/${categoryId}`, { method: "DELETE" });
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <section className="admin-two-column">
      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>{editingId ? "Edit category" : "Category management"}</h2>
          <p>Add parent categories and curated subcategories</p>
        </div>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <label className="admin-form-span">
            <span>Category name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </label>

          <div className="admin-form-span">
            <span className="admin-field-label">Subcategories</span>
            <div className="admin-list-stack compact">
              {form.subcategories.map((subcategory, index) => (
                <input
                  key={`${index}-${subcategory}`}
                  value={subcategory}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subcategories: current.subcategories.map((value, valueIndex) =>
                        valueIndex === index ? event.target.value : value
                      ),
                    }))
                  }
                  placeholder="e.g. Men Suits"
                />
              ))}
            </div>
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  subcategories: [...current.subcategories, ""],
                }))
              }
            >
              <Plus size={16} />
              <span>Add subcategory</span>
            </button>
          </div>

          {error ? <p className="admin-inline-error admin-form-span">{error}</p> : null}

          <div className="admin-form-actions admin-form-span">
            <button type="submit" className="admin-primary-btn">
              <Plus size={16} />
              <span>{editingId ? "Update Category" : "Save Category"}</span>
            </button>
            <button type="button" className="admin-secondary-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>Available categories</h2>
          <p>{categories.length} configured groups</p>
        </div>
        <div className="admin-list-stack">
          {categories.map((category) => (
            <div key={category._id} className="admin-category-row">
              <div>
                <strong>{category.name}</strong>
                <p>
                  {category.subcategories?.map((subcategory) => subcategory.name).join(", ")}
                </p>
              </div>
              <div className="admin-product-row__actions">
                <button type="button" className="admin-icon-btn" onClick={() => handleEdit(category)}>
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  onClick={() => handleDelete(category._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminCategories;
