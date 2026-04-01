import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { adminRequest } from "../../utils/adminApi";
import { resolveImageUrl } from "../../utils/images";

const emptyForm = {
  name: "",
  price: "",
  parentCategory: "",
  category: "",
  description: "",
  tags: "",
  image: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [productData, categoryData] = await Promise.all([
      adminRequest("/admin/products"),
      adminRequest("/admin/categories"),
    ]);

    setProducts(productData);
    setCategories(categoryData);
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.message || "Failed to load products"));
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.name === form.parentCategory),
    [categories, form.parentCategory]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      subcategory: form.category,
    };

    try {
      if (editingId) {
        await adminRequest(`/admin/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminRequest("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      parentCategory: product.parentCategory || "",
      category: product.subcategory || product.category || "",
      description: product.description || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      image: product.image || "",
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminRequest(`/admin/products/${productId}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <section className="admin-two-column admin-products-layout">
      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>{editingId ? "Edit product" : "Add new product"}</h2>
          <p>Manage the catalog without touching the shopper UI.</p>
        </div>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Product name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </label>
          <label>
            <span>Price</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({ ...current, price: event.target.value }))
              }
              required
            />
          </label>
          <label>
            <span>Parent category</span>
            <select
              value={form.parentCategory}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  parentCategory: event.target.value,
                  category: "",
                }))
              }
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Subcategory</span>
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              required
            >
              <option value="">Select subcategory</option>
              {(selectedCategory?.subcategories || []).map((subcategory) => (
                <option key={subcategory._id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-form-span">
            <span>Description</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </label>
          <label className="admin-form-span">
            <span>Tags</span>
            <input
              value={form.tags}
              onChange={(event) =>
                setForm((current) => ({ ...current, tags: event.target.value }))
              }
              placeholder="formal, workwear, premium"
            />
          </label>
          <label className="admin-form-span">
            <span>Image URL or upload</span>
            <input
              value={form.image}
              onChange={(event) =>
                setForm((current) => ({ ...current, image: event.target.value }))
              }
              placeholder="https://... or upload below"
            />
          </label>
          <label className="admin-upload-field admin-form-span">
            <span>Upload image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div>
              <Upload size={16} />
              <span>Choose image for preview and storage</span>
            </div>
          </label>

          {form.image ? (
            <div className="admin-image-preview admin-form-span">
              <img src={resolveImageUrl(form.image)} alt="Preview" />
            </div>
          ) : null}

          {error ? <p className="admin-inline-error admin-form-span">{error}</p> : null}

          <div className="admin-form-actions admin-form-span">
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              <Plus size={16} />
              <span>{saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}</span>
            </button>
            <button type="button" className="admin-secondary-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>Catalog inventory</h2>
          <p>{products.length} products available</p>
        </div>

        <div className="admin-list-stack">
          {products.map((product) => (
            <div key={product._id} className="admin-product-row">
              <div className="admin-product-row__main">
                <div className="admin-product-thumb">
                  {product.image ? (
                    <img src={resolveImageUrl(product.image)} alt={product.name} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.parentCategory || "Uncategorized"}
                    {product.category ? ` / ${product.category}` : ""}
                  </p>
                </div>
              </div>
              <div className="admin-product-row__actions">
                <span>Rs. {product.price}</span>
                <button type="button" className="admin-icon-btn" onClick={() => handleEdit(product)}>
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  onClick={() => handleDelete(product._id)}
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

export default AdminProducts;
