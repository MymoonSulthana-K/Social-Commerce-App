const categories = {
  Men: [
    { label: "Suits", value: "Men Suits" },
    { label: "Ties", value: "Men Ties" },
    { label: "Shoes", value: "Men Shoes" },
    { label: "Watches", value: "Men Watches" },
  ],
  Women: [
    { label: "Suits", value: "Women Suits" },
    { label: "Shoes", value: "Women Footwear" },
    { label: "Bags", value: "Bags" },
    { label: "Watches", value: "Women Watches" },
  ],
};

export default function CategorySidebar({
  selectedMajor,
  selectedSub,
  onSelectMajor,
  onSelectSub,
}) {
  return (
    <aside className="catalog-sidebar">
      <h2>Shop by Category</h2>

      <button
        className={`category-btn ${!selectedMajor ? "active" : ""}`}
        onClick={() => {
          onSelectMajor(null);
          onSelectSub(null);
        }}
      >
        All Products
      </button>

      {Object.entries(categories).map(([major, subcategories]) => (
        <div key={major} className="category-group">
          <button
            className={`category-btn ${selectedMajor === major ? "active" : ""}`}
            onClick={() => {
              onSelectMajor(major);
              onSelectSub(null);
            }}
          >
            {major}
          </button>

          {selectedMajor === major && (
            <div className="subcategory-list">
              <button
                className={`subcategory-btn ${selectedSub === null ? "active" : ""}`}
                onClick={() => onSelectSub(null)}
              >
                All {major}
              </button>
              {subcategories.map(({ label, value }) => (
                <button
                  key={value}
                  className={`subcategory-btn ${selectedSub === value ? "active" : ""}`}
                  onClick={() => onSelectSub(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
