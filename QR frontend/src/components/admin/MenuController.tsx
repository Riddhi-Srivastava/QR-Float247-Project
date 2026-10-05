import React, { useMemo, useState } from "react";
import {
  Search,
  ToggleLeft,
  ToggleRight,
  Check,
  Utensils,
  Plus,
  X,
  MoreVertical,
  Pencil,
  Download,
  Star,
  Tag,
  IndianRupee,
  PackageCheck,
  Clock,
  Image as ImageIcon,
  Store,
  FileText,
  Leaf,
  SearchX,
  LayoutGrid,
  Drumstick,
  Wheat,
  Soup,
  Salad,
  IceCream,
  CupSoda,
} from "lucide-react";

import { MenuItem } from "../../types/restaurant";
import api from "../../lib/api";

// =====================================================
// TYPES
// =====================================================

interface AddMenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: "VEG" | "NON_VEG";
  image: string;
  prepTime: number;
  restaurantId: string;
  categoryId: string;
  available: boolean;
  popular: boolean;
  featured: boolean;
}

interface EditMenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: "VEG" | "NON_VEG";
  image: string;
  prepTime: number;
  categoryId: string;
  available: boolean;
  popular: boolean;
  featured: boolean;
}

interface MenuControllerProps {
  menuItems: MenuItem[];
  onToggleAvailability: (itemId: string) => void;
  onUpdatePrice: (itemId: string, newPrice: number) => void;
  onAddMenuItem?: (data: AddMenuItemData) => Promise<void> | void;
  onEditMenuItem?: (data: EditMenuItemData) => Promise<void> | void;
}

// =====================================================
// CATEGORY ICON (display only)
// =====================================================

const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();

  if (c === "all") return LayoutGrid;
  if (/bread|naan|roti|paratha|kulcha/.test(c)) return Wheat;
  if (/rice|biryani|pulao/.test(c)) return Soup;
  if (/starter|appetizer|appetiser|snack|tikka|kebab/.test(c)) return Salad;
  if (/dessert|sweet|ice|cake/.test(c)) return IceCream;
  if (/drink|beverage|shake|juice|soda|tea|coffee/.test(c)) return CupSoda;
  if (/main|curry|gravy/.test(c)) return Drumstick;

  return Utensils;
};

// =====================================================
// COMPONENT
// =====================================================

export const MenuController: React.FC<MenuControllerProps> = ({
  menuItems,
  onToggleAvailability,
  onUpdatePrice,
  onAddMenuItem,
  onEditMenuItem,
}) => {
  // SEARCH / FILTER
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // PRICE EDIT
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // EDIT MENU
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editMenu, setEditMenu] = useState({
    name: "",
    description: "",
    price: "",
    veg: "VEG" as "VEG" | "NON_VEG",
    image: "",
    prepTime: "",
    categoryId: "",
    available: true,
    popular: false,
    featured: false,
  });

  // ADD MENU
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: "",
    description: "",
    price: "",
    veg: "VEG" as "VEG" | "NON_VEG",
    image: "",
    prepTime: "",
    restaurantId: "",
    categoryId: "",
    available: true,
    popular: false,
    featured: false,
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // CATEGORIES (real data)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        menuItems.map((item) => String(item.category || "").trim()).filter(Boolean)
      )
    );
    return ["all", ...uniqueCategories];
  }, [menuItems]);

  // CATEGORY COUNTS (display only)
  const categoryCount = useMemo(() => {
    const map: Record<string, number> = { all: menuItems.length };
    menuItems.forEach((item) => {
      const c = String(item.category || "").trim();
      if (c) map[c] = (map[c] || 0) + 1;
    });
    return map;
  }, [menuItems]);

  const inStockCount = menuItems.filter((i) => i.isAvailable !== false).length;

  // FILTER MENU
  const filteredItems = menuItems.filter((item) => {
    const category = String(item.category || "");
    const name = String(item.name || "");
    const matchCategory = selectedCategory === "all" || category === selectedCategory;
    const query = search.toLowerCase().trim();
    const matchSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  // PRICE SAVE
  const handleSavePrice = (itemId: string) => {
    const value = Number(tempPrice);
    if (Number.isFinite(value) && value > 0) {
      onUpdatePrice(itemId, value);
    }
    setEditingPriceId(null);
    setTempPrice("");
  };

  // ADD MENU
  const handleNewMenuChange = (field: string, value: string | boolean) => {
    setNewMenu((prev) => ({ ...prev, [field]: value }));
  };

  const resetNewMenu = () => {
    setNewMenu({
      name: "",
      description: "",
      price: "",
      veg: "VEG",
      image: "",
      prepTime: "",
      restaurantId: "",
      categoryId: "",
      available: true,
      popular: false,
      featured: false,
    });
    setNewImageFile(null);
  };

  const handleAddMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!onAddMenuItem) {
      alert("Add Menu functionality is not connected.");
      return;
    }

    const name = newMenu.name.trim();
    const description = newMenu.description.trim();
    const restaurantId = newMenu.restaurantId.trim();
    const categoryId = newMenu.categoryId.trim();
    const price = Number(newMenu.price);
    const prepTime = Number(newMenu.prepTime);

    if (!name || !description || !newImageFile || !restaurantId || !categoryId) {
      alert("Please fill all required fields.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    if (!Number.isFinite(prepTime) || prepTime < 0) {
      alert("Please enter a valid preparation time.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("image", newImageFile);

      const uploadResponse = await api.post(
        "/admin/foods/upload-image",
        formData
      );

      if (
        !uploadResponse.data?.success ||
        !uploadResponse.data?.imageUrl
      ) {
        throw new Error(
          uploadResponse.data?.message || "Image upload failed"
        );
      }

      const payload: AddMenuItemData = {
        id: crypto.randomUUID(),
        name,
        description,
        price,
        veg: newMenu.veg,
        image: uploadResponse.data.imageUrl,
        prepTime,
        restaurantId,
        categoryId,
        available: newMenu.available,
        popular: newMenu.popular,
        featured: newMenu.featured,
      };

      await onAddMenuItem(payload);
      resetNewMenu();
      setShowAddMenu(false);
    } catch (error) {
      console.error("Add menu item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT MENU
  const handleDownloadImage = (item: MenuItem) => {
    if (!item.image) {
      alert("Image is not available for download.");
      return;
    }

    const downloadUrl = item.image.replace("/upload/", "/upload/fl_attachment/");
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${item.name || "menu-item"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setEditImageFile(null);
    setEditMenu({
      name: item.name || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      veg: item.dietary === "non-veg" ? "NON_VEG" : "VEG",
      image: item.image || "",
      prepTime: String(item.prepTimeMinutes ?? ""),
      categoryId: String(item.category || ""),
      available: item.isAvailable !== false,
      popular: item.isBestseller === true,
      featured: item.isChefSpecial === true,
    });
    setOpenMenuId(null);
  };

  const handleEditMenuChange = (field: string, value: string | boolean) => {
    setEditMenu((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!onEditMenuItem) {
      alert("Edit Menu functionality is not connected.");
      return;
    }

    const name = editMenu.name.trim();
    const description = editMenu.description.trim();
    const image = editMenu.image.trim();
    const categoryId = editMenu.categoryId.trim();
    const price = Number(editMenu.price);
    const prepTime = Number(editMenu.prepTime);

    if (!name || !description || !image || !categoryId) {
      alert("Please fill all required fields.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    if (!Number.isFinite(prepTime) || prepTime < 0) {
      alert("Please enter a valid preparation time.");
      return;
    }

    try {
      setIsEditSubmitting(true);

      let imageUrl = image;

      if (editImageFile) {
        const formData = new FormData();
        formData.append("image", editImageFile);

        const uploadResponse = await api.post(
          "/admin/foods/upload-image",
          formData
        );

        if (
          !uploadResponse.data?.success ||
          !uploadResponse.data?.imageUrl
        ) {
          throw new Error(
            uploadResponse.data?.message || "Image upload failed"
          );
        }

        imageUrl = uploadResponse.data.imageUrl;
      }

      const payload: EditMenuItemData = {
        id: editingItem.id,
        name,
        description,
        price,
        veg: editMenu.veg,
        image: imageUrl,
        prepTime,
        categoryId,
        available: editMenu.available,
        popular: editMenu.popular,
        featured: editMenu.featured,
      };

      await onEditMenuItem(payload);
      setEditingItem(null);
    } catch (error) {
      console.error("Edit menu item error:", error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mc">
      <div className="mc-cq">
      {/* ================= TOOLBAR ================= */}
      <div className="mc-card mc-toolbar">
        <div className="mc-toolbar-top">
          <div className="mc-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by dish or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="mc-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="mc-summary">
            <span>
              <b>{menuItems.length}</b> items
            </span>
            <span className="mc-summary-dot" />
            <span>
              <b>{inStockCount}</b> in stock
            </span>
          </div>

          <button type="button" className="mc-btn-primary mc-btn-add" onClick={() => setShowAddMenu(true)}>
            <span className="mc-btn-add-icon">
              <Plus size={14} strokeWidth={3} />
            </span>
            Add menu item
          </button>
        </div>

        <div className="mc-chips">
          {categories.map((category) => {
            const active = selectedCategory === category;
            const CategoryIcon = getCategoryIcon(category);
            return (
              <button
                key={category}
                type="button"
                className={`mc-chip ${active ? "is-active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="mc-chip-icon">
                  <CategoryIcon size={14} strokeWidth={2.4} />
                </span>
                {category === "all" ? "All" : category}
                <span className="mc-chip-count">{categoryCount[category] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="mc-card mc-table">
        <div className="mc-row mc-head">
          <span className="mc-th">
            <Utensils size={14} /> Dish
          </span>
          <span className="mc-th">
            <Tag size={14} /> Category
          </span>
          <span className="mc-th">
            <IndianRupee size={14} /> Price
          </span>
          <span className="mc-th">
            <Star size={14} /> Rating
          </span>
          <span className="mc-th">
            <PackageCheck size={14} /> Availability
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="mc-empty">
            <SearchX size={28} />
            <strong>No menu items found</strong>
            <span>Try a different search or pick another category.</span>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isAvailable = item.isAvailable !== false;
            const isVeg = item.dietary === "veg" || item.dietary === "vegan";

            return (
              <div
                key={item.id}
                className={`mc-row mc-item ${isAvailable ? "" : "is-off"} ${openMenuId === item.id ? "is-open" : ""}`}
              >
                {/* DISH */}
                <div className="mc-dish">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="mc-thumb" />
                  ) : (
                    <div className="mc-thumb mc-thumb-empty">
                      <Utensils size={18} />
                    </div>
                  )}
                  <div className="mc-dish-text">
                    <div className="mc-dish-name">
                      <span className={`mc-diet ${isVeg ? "veg" : "nonveg"}`} title={isVeg ? "Veg" : "Non-veg"}>
                        <i />
                      </span>
                      <span className="mc-ellipsis">{item.name}</span>
                    </div>
                    {item.prepTimeMinutes !== undefined && item.prepTimeMinutes !== null && (
                      <div className="mc-meta">
                        <Clock size={11} /> {item.prepTimeMinutes} min
                      </div>
                    )}
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="mc-cell" data-label="Category">
                  <span className="mc-tag">{String(item.category || "—")}</span>
                </div>

                {/* PRICE */}
                <div className="mc-cell" data-label="Price">
                  {editingPriceId === item.id ? (
                    <div className="mc-price-edit">
                      <span>₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tempPrice}
                        autoFocus
                        onChange={(e) => setTempPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSavePrice(item.id);
                          if (e.key === "Escape") {
                            setEditingPriceId(null);
                            setTempPrice("");
                          }
                        }}
                      />
                      <button type="button" onClick={() => handleSavePrice(item.id)} aria-label="Save price">
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mc-price"
                      title="Click to edit price"
                      onClick={() => {
                        setEditingPriceId(item.id);
                        setTempPrice(String(item.price ?? ""));
                      }}
                    >
                      ₹{Number(item.price || 0).toFixed(2)}
                      <Pencil size={11} />
                    </button>
                  )}
                </div>

                {/* RATING */}
                <div className="mc-cell" data-label="Rating">
                  <span className="mc-rating">
                    <Star size={13} fill="currentColor" />
                    {item.rating ?? "N/A"}
                    {item.ratingCount ? <em>({item.ratingCount})</em> : null}
                  </span>
                </div>

                {/* AVAILABILITY */}
                <div className="mc-cell mc-avail" data-label="Availability">
                  <button
                    type="button"
                    className={`mc-stock ${isAvailable ? "in" : "out"}`}
                    onClick={() => onToggleAvailability(item.id)}
                  >
                    {isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {isAvailable ? "In stock" : "Sold out"}
                  </button>

                  <div className="mc-more-wrap">
                    <button
                      type="button"
                      className="mc-icon-btn"
                      title="More options"
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === item.id && (
                      <div className="mc-dropdown">
                        <button type="button" onClick={() => handleEditClick(item)}>
                          <Pencil size={13} /> Edit
                        </button>
                        <button type="button" onClick={() => handleDownloadImage(item)}>
                          <Download size={13} /> Download
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      </div>

      {/* ================= ADD MODAL ================= */}
      {showAddMenu && (
        <Modal
          title="Add menu item"
          subtitle="Add a new food item to the menu"
          onClose={() => setShowAddMenu(false)}
          onSubmit={handleAddMenuSubmit}
          submitting={isSubmitting}
          submitLabel="Add menu item"
          submittingLabel="Adding..."
          zIndex={9999}
        >
          <Field label="Food name" icon={<Utensils size={13} />} full>
            <input
              required
              className="mc-input"
              value={newMenu.name}
              onChange={(e) => handleNewMenuChange("name", e.target.value)}
              placeholder="e.g. Crispy Chicken Burger"
            />
          </Field>
          <Field label="Description" icon={<FileText size={13} />} full>
            <textarea
              required
              rows={3}
              className="mc-input mc-textarea"
              value={newMenu.description}
              onChange={(e) => handleNewMenuChange("description", e.target.value)}
              placeholder="Enter food description"
            />
          </Field>
          <Field label="Price" icon={<IndianRupee size={13} />}>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              className="mc-input"
              value={newMenu.price}
              onChange={(e) => handleNewMenuChange("price", e.target.value)}
              placeholder="299"
            />
          </Field>
          <Field label="Preparation time (minutes)" icon={<Clock size={13} />}>
            <input
              required
              type="number"
              min="0"
              className="mc-input"
              value={newMenu.prepTime}
              onChange={(e) => handleNewMenuChange("prepTime", e.target.value)}
              placeholder="15"
            />
          </Field>
          <Field label="Food type" icon={<Leaf size={13} />}>
            <select
              className="mc-input"
              value={newMenu.veg}
              onChange={(e) => handleNewMenuChange("veg", e.target.value as "VEG" | "NON_VEG")}
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-veg</option>
            </select>
          </Field>
          <Field label="Photo" icon={<ImageIcon size={13} />}>
            <input
              required
              type="file"
              accept="image/*"
              className="mc-input"
              onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
            />
          </Field>
          <Field label="Restaurant ID" icon={<Store size={13} />}>
            <input
              required
              className="mc-input"
              value={newMenu.restaurantId}
              onChange={(e) => handleNewMenuChange("restaurantId", e.target.value)}
              placeholder="Restaurant ID"
            />
          </Field>
          <Field label="Category ID" icon={<Tag size={13} />}>
            <input
              required
              className="mc-input"
              value={newMenu.categoryId}
              onChange={(e) => handleNewMenuChange("categoryId", e.target.value)}
              placeholder="Category ID"
            />
          </Field>
          <div className="mc-options mc-full">
            <CheckBox label="Available" checked={newMenu.available} onChange={(v) => handleNewMenuChange("available", v)} />
            <CheckBox label="Popular" checked={newMenu.popular} onChange={(v) => handleNewMenuChange("popular", v)} />
            <CheckBox label="Featured" checked={newMenu.featured} onChange={(v) => handleNewMenuChange("featured", v)} />
          </div>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingItem && (
        <Modal
          title="Edit menu item"
          subtitle="Update selected food item"
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditMenuSubmit}
          submitting={isEditSubmitting}
          submitLabel="Save changes"
          submittingLabel="Saving..."
          zIndex={10000}
        >
          <Field label="Food name" icon={<Utensils size={13} />} full>
            <input
              required
              className="mc-input"
              value={editMenu.name}
              onChange={(e) => handleEditMenuChange("name", e.target.value)}
            />
          </Field>
          <Field label="Description" icon={<FileText size={13} />} full>
            <textarea
              required
              rows={3}
              className="mc-input mc-textarea"
              value={editMenu.description}
              onChange={(e) => handleEditMenuChange("description", e.target.value)}
            />
          </Field>
          <Field label="Price" icon={<IndianRupee size={13} />}>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              className="mc-input"
              value={editMenu.price}
              onChange={(e) => handleEditMenuChange("price", e.target.value)}
            />
          </Field>
          <Field label="Preparation time (minutes)" icon={<Clock size={13} />}>
            <input
              required
              type="number"
              min="0"
              className="mc-input"
              value={editMenu.prepTime}
              onChange={(e) => handleEditMenuChange("prepTime", e.target.value)}
            />
          </Field>
          <Field label="Food type" icon={<Leaf size={13} />}>
            <select
              className="mc-input"
              value={editMenu.veg}
              onChange={(e) => handleEditMenuChange("veg", e.target.value as "VEG" | "NON_VEG")}
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-veg</option>
            </select>
          </Field>
          <Field label="Photo" icon={<ImageIcon size={13} />}>
            {editMenu.image && (
              <img
                src={editMenu.image}
                alt={editMenu.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "8px",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="mc-input"
              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
            />
          </Field>
          <Field label="Category ID" icon={<Tag size={13} />} full>
            <input
              required
              className="mc-input"
              value={editMenu.categoryId}
              onChange={(e) => handleEditMenuChange("categoryId", e.target.value)}
            />
          </Field>
          <div className="mc-options mc-full">
            <CheckBox label="Available" checked={editMenu.available} onChange={(v) => handleEditMenuChange("available", v)} />
            <CheckBox label="Popular" checked={editMenu.popular} onChange={(v) => handleEditMenuChange("popular", v)} />
            <CheckBox label="Featured" checked={editMenu.featured} onChange={(v) => handleEditMenuChange("featured", v)} />
          </div>
        </Modal>
      )}

      <style>{CSS}</style>
    </div>
  );
};

// =====================================================
// SMALL SHARED PIECES
// =====================================================

interface ModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  zIndex: number;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  onClose,
  onSubmit,
  submitting,
  submitLabel,
  submittingLabel,
  zIndex,
  children,
}) => (
  <div
    className="mc-overlay"
    style={{ zIndex }}
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <form className="mc-modal" onSubmit={onSubmit}>
      <div className="mc-modal-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="mc-icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="mc-form-grid">{children}</div>

      <div className="mc-modal-actions">
        <button type="button" className="mc-btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="mc-btn-primary" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  </div>
);

const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  full?: boolean;
  children: React.ReactNode;
}> = ({ label, icon, full, children }) => (
  <div className={full ? "mc-full" : undefined}>
    <label className="mc-label">
      {icon} {label} <span className="mc-req">*</span>
    </label>
    {children}
  </div>
);

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onChange }) => (
  <label className="mc-check">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

// =====================================================
// STYLES
// =====================================================

const CSS = `
.mc {
  --red: #d62300;
  --red-dark: #b91c00;
  --ink: #24120d;
  --muted: #806c61;
  --soft: #5d463b;
  --line: rgba(59,36,24,0.08);
  --surface: #fffdf9;
  --tint: #fbf4ec;
  --green: #509e2f;

  /* Height is never fixed: the page grows with its content.
     The bottom padding keeps the last row's action dropdown
     fully inside the page instead of getting cut off. */
  width: 100%;
  height: auto;
  min-height: 0;
  padding-bottom: 110px;
  box-sizing: border-box;
  color: var(--ink);
  font-size: 13px;
  overflow: visible;
}
.mc *, .mc *::before, .mc *::after { box-sizing: border-box; }
.mc button { font-family: inherit; }
.mc button:focus-visible, .mc input:focus-visible, .mc select:focus-visible, .mc textarea:focus-visible {
  outline: 2px solid rgba(214,35,0,0.35); outline-offset: 1px;
}

.mc-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(59,36,24,0.03);
}

/* ---------- toolbar ---------- */
.mc-toolbar { padding: 12px; margin-bottom: 14px; display: grid; gap: 12px; }
.mc-toolbar-top { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.mc-search {
  flex: 1; min-width: 220px; height: 46px; display: flex; align-items: center; gap: 10px;
  padding: 0 8px 0 7px; color: var(--muted);
  background: linear-gradient(180deg, #fffaf4 0%, #fbf1e6 100%);
  border: 1.5px solid #f3e3d3; border-radius: 999px;
  box-shadow: inset 0 2px 4px rgba(120,75,50,0.05), 0 2px 8px rgba(120,75,50,0.04);
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.mc-search > svg:first-child {
  width: 32px; height: 32px; padding: 8px; flex-shrink: 0;
  border-radius: 50%; background: #fde9df; color: var(--red);
}
.mc-search:hover { border-color: #ecd3bd; }
.mc-search:focus-within {
  border-color: rgba(214,35,0,0.35); background: #fff;
  box-shadow: 0 0 0 4px rgba(214,35,0,0.07), 0 4px 14px rgba(214,35,0,0.07);
}
.mc-search input { flex: 1; min-width: 0; border: none; outline: none !important; background: transparent; color: var(--ink); font-size: 13.5px; font-weight: 600; }
.mc-search input::placeholder { color: #b49a8c; font-weight: 600; }
.mc-search-clear { width: 28px; height: 28px; flex-shrink: 0; border: none; background: #f3e4d6; color: var(--soft); display: grid; place-items: center; cursor: pointer; border-radius: 50%; transition: background .15s, color .15s; }
.mc-search-clear:hover { background: var(--red); color: #fff; }

.mc-summary { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 12px; white-space: nowrap; }
.mc-summary b { color: var(--ink); font-weight: 700; }
.mc-summary-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--muted); opacity: .6; }

.mc-btn-primary {
  height: 40px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border: none; border-radius: 10px; background: var(--red); color: #fff; font-size: 13px; font-weight: 700;
  cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(214,35,0,0.2); transition: background .15s;
}
.mc-btn-primary:hover:not(:disabled) { background: var(--red-dark); }
.mc-btn-primary:disabled { background: #9b7568; cursor: not-allowed; box-shadow: none; }
.mc-btn-ghost {
  height: 40px; padding: 0 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--tint);
  color: var(--soft); font-size: 13px; font-weight: 700; cursor: pointer;
}
.mc-btn-ghost:hover { background: #f6ebdf; }

/* catchy "Add menu item" button */
.mc-btn-add {
  position: relative; overflow: hidden; height: 46px; padding: 0 20px 0 10px; gap: 10px;
  border-radius: 999px; font-size: 13.5px; letter-spacing: .2px;
  background: linear-gradient(135deg, #ff5a1f 0%, #e8300a 50%, #c91f00 100%);
  box-shadow: 0 8px 20px rgba(214,35,0,0.28), inset 0 1px 0 rgba(255,255,255,0.28);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}
.mc-btn-add::after {
  content: ""; position: absolute; top: 0; left: -70%; width: 45%; height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent);
  transform: skewX(-20deg); transition: left .6s ease; pointer-events: none;
}
.mc-btn-add:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff6a2f 0%, #f03a10 50%, #d62300 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(214,35,0,0.36), inset 0 1px 0 rgba(255,255,255,0.3);
}
.mc-btn-add:hover:not(:disabled)::after { left: 120%; }
.mc-btn-add:active:not(:disabled) { transform: translateY(0); }
.mc-btn-add-icon {
  width: 28px; height: 28px; flex-shrink: 0; display: grid; place-items: center;
  border-radius: 50%; background: #fff; color: #d62300;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: transform .25s ease;
}
.mc-btn-add:hover .mc-btn-add-icon { transform: rotate(90deg) scale(1.06); }

.mc-chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
.mc-chip {
  height: 32px; padding: 0 12px; flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid var(--line); border-radius: 999px; background: var(--tint); color: var(--soft);
  font-size: 12px; font-weight: 600; cursor: pointer; text-transform: capitalize; transition: all .15s;
}
.mc-chip { padding-left: 7px; height: 36px; }
.mc-chip-icon {
  width: 24px; height: 24px; flex-shrink: 0; display: grid; place-items: center;
  border-radius: 50%; background: #fde9df; color: var(--red); transition: background .15s, color .15s;
}
.mc-chip:hover { border-color: rgba(214,35,0,0.3); }
.mc-chip.is-active { background: var(--red); border-color: var(--red); color: #fff; box-shadow: 0 4px 12px rgba(214,35,0,0.22); }
.mc-chip.is-active .mc-chip-icon { background: rgba(255,255,255,0.22); color: #fff; }
.mc-chip-count { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 999px; background: rgba(59,36,24,0.08); }
.mc-chip.is-active .mc-chip-count { background: rgba(255,255,255,0.22); }

/* ---------- table ---------- */
/* No fixed/max height anywhere: rows decide the height, so the
   table grows with the number of items. Overflow stays visible so
   the dropdown is never clipped by the card. */
.mc-table { height: auto; max-height: none; overflow: visible; }
.mc-row {
  display: grid; grid-template-columns: minmax(240px,2.2fr) minmax(90px,1fr) 120px 110px 170px;
  gap: 12px; align-items: center; padding: 14px 16px; min-height: 72px;
}
.mc-head { min-height: 0; background: var(--tint); border-bottom: 1px solid var(--line); border-radius: 14px 14px 0 0; padding: 11px 16px; }
.mc-th { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 12px; font-weight: 700; }
.mc-th svg { color: var(--red); opacity: .85; }
.mc-item { position: relative; border-bottom: 1px solid rgba(59,36,24,0.05); transition: background .12s; }
.mc-item:last-child { border-bottom: none; border-radius: 0 0 14px 14px; }
.mc-item:hover { background: #fffaf3; }
/* the row with an open dropdown always sits above its neighbours */
.mc-item.is-open { z-index: 20; background: #fffaf3; }
.mc-item.is-off .mc-dish, .mc-item.is-off .mc-cell:not(.mc-avail) { opacity: .55; }

.mc-dish { display: flex; align-items: center; gap: 12px; min-width: 0; }
.mc-thumb { width: 48px; height: 48px; flex-shrink: 0; object-fit: cover; border-radius: 10px; background: #f1e5d9; }
.mc-thumb-empty { display: grid; place-items: center; color: var(--red); }
.mc-dish-text { min-width: 0; }
.mc-dish-name { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; min-width: 0; }
.mc-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.mc-meta { margin-top: 3px; display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); }

.mc-diet { width: 13px; height: 13px; flex-shrink: 0; border: 1.5px solid; border-radius: 3px; display: grid; place-items: center; }
.mc-diet i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.mc-diet.veg { color: var(--green); }
.mc-diet.nonveg { color: var(--red); }

.mc-tag { display: inline-block; max-width: 100%; padding: 4px 10px; border-radius: 999px; background: #f7eee5; color: #6d5143; font-size: 11px; font-weight: 600; text-transform: capitalize; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }

.mc-price {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; margin-left: -8px; border: none; border-radius: 8px;
  background: transparent; color: var(--ink); font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap;
}
.mc-price svg { color: var(--muted); opacity: 0; transition: opacity .12s; }
.mc-price:hover { background: #f7eee5; }
.mc-price:hover svg { opacity: 1; }
.mc-price-edit { display: flex; align-items: center; gap: 4px; }
.mc-price-edit span { font-weight: 700; color: var(--red); }
.mc-price-edit input { width: 70px; height: 30px; padding: 0 8px; border: 1px solid var(--red); border-radius: 8px; background: #fff; color: var(--ink); font-size: 12px; font-weight: 700; outline: none; }
.mc-price-edit button { width: 30px; height: 30px; border: none; border-radius: 8px; background: var(--red); color: #fff; display: grid; place-items: center; cursor: pointer; flex-shrink: 0; }

.mc-rating { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.mc-rating svg { color: #f2a600; }
.mc-rating em { font-style: normal; font-weight: 500; color: var(--muted); font-size: 11px; }

.mc-avail { display: flex; align-items: center; gap: 8px; }
.mc-stock {
  height: 32px; padding: 0 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 999px;
  font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid transparent; white-space: nowrap;
}
.mc-stock.in { background: #edf7e9; color: var(--green); border-color: rgba(80,158,47,0.18); }
.mc-stock.out { background: #fff0eb; color: var(--red); border-color: rgba(214,35,0,0.15); }

.mc-more-wrap { position: relative; flex-shrink: 0; }
.mc-icon-btn { width: 32px; height: 32px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--soft); display: grid; place-items: center; cursor: pointer; flex-shrink: 0; }
.mc-icon-btn:hover { background: #f7eee5; }
.mc-dropdown { position: absolute; right: 0; top: calc(100% + 6px); z-index: 100; min-width: 140px; padding: 6px; background: #fff; border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); }
.mc-dropdown button { width: 100%; min-height: 36px; display: flex; align-items: center; gap: 8px; border: none; background: transparent; padding: 8px 10px; text-align: left; border-radius: 7px; color: var(--ink); font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.mc-dropdown button:hover { background: var(--tint); }

.mc-empty { padding: 44px 20px; display: grid; justify-items: center; gap: 6px; text-align: center; color: var(--muted); }
.mc-empty strong { color: var(--ink); font-size: 14px; }

/* ---------- modal ---------- */
.mc-overlay { position: fixed; inset: 0; background: rgba(24,12,7,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; overscroll-behavior: contain; }
.mc-modal { width: 100%; max-width: 720px; max-height: 90vh; max-height: 90dvh; overflow-y: auto; background: var(--surface); border-radius: 18px; box-shadow: 0 24px 70px rgba(0,0,0,0.25); padding: 22px; }
.mc-modal-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.mc-modal-head h3 { margin: 0; font-size: 18px; font-weight: 800; }
.mc-modal-head p { margin: 4px 0 0; font-size: 12px; color: var(--muted); }
.mc-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
.mc-full { grid-column: 1 / -1; }
.mc-label { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 12px; font-weight: 600; color: var(--soft); }
.mc-label svg { color: var(--muted); }
.mc-req { color: var(--red); }
.mc-input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid rgba(59,36,24,0.12); border-radius: 10px; background: var(--tint); color: var(--ink); font-size: 13px; font-weight: 500; font-family: inherit; outline: none; transition: border-color .15s, background .15s; }
.mc-input:focus { border-color: rgba(214,35,0,0.5); background: #fff; }
.mc-textarea { height: auto; padding: 10px 12px; resize: vertical; }
.mc-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--tint); border: 1px solid var(--line); }
.mc-check { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--soft); }
.mc-check input { width: 16px; height: 16px; accent-color: var(--red); cursor: pointer; }
.mc-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

/* ---------- responsive ---------- */
/* overflow stays visible so a container never clips the dropdown */
.mc-cq { container-type: inline-size; container-name: mc; overflow: visible; }
.mc-row > * { min-width: 0; }

/* medium panels: tighten the columns before switching to cards */
@container mc (max-width: 1040px) {
  .mc-row { grid-template-columns: minmax(200px,2fr) minmax(80px,.9fr) 104px 96px 160px; gap: 10px; padding-left: 14px; padding-right: 14px; }
}

/* panel width (not screen width) decides the layout */
@container mc (max-width: 820px) {
  .mc-head { display: none; }
  .mc-summary { display: none; }

  .mc-search { flex: 1 1 100%; }
  .mc-toolbar-top .mc-btn-primary { flex: 1 1 100%; }

  .mc-row {
    grid-template-columns: auto auto 1fr;
    gap: 12px 10px;
    padding: 14px;
    min-height: 0;
  }
  .mc-dish { grid-column: 1 / -1; grid-row: 1; }
  .mc-cell[data-label="Category"] { grid-column: 1; grid-row: 2; min-width: 0; max-width: 100%; }
  .mc-cell[data-label="Rating"] { grid-column: 2; grid-row: 2; }
  .mc-cell[data-label="Price"] { grid-column: 3; grid-row: 2; justify-self: end; }
  .mc-avail { grid-column: 1 / -1; grid-row: 3; justify-content: space-between; padding-top: 12px; border-top: 1px dashed var(--line); }
  .mc-price { margin: 0 -8px 0 0; font-size: 14px; color: var(--red); }
  .mc-price svg { opacity: .55; }
  .mc-price-edit input { width: 80px; }
  .mc-item:last-child { border-radius: 0 0 14px 14px; }
}

@container mc (max-width: 380px) {
  .mc-chip { height: 30px; padding: 0 10px; }
  .mc-thumb { width: 44px; height: 44px; }
  .mc-row { padding: 12px; }
}

/* modals are fixed to the screen, so they use screen width */
@media (max-width: 600px) {
  .mc { padding-bottom: 130px; }
  .mc-overlay { padding: 12px; align-items: flex-end; }
  .mc-modal { padding: 16px; max-height: 92vh; max-height: 92dvh; border-radius: 16px; }
  .mc-form-grid, .mc-options { grid-template-columns: 1fr; }
  .mc-modal-actions .mc-btn-primary, .mc-modal-actions .mc-btn-ghost { flex: 1; }
}
`;