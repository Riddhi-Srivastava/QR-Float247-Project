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

} from "lucide-react";

import { MenuItem } from "../../types/restaurant";

// =====================================================

// ADD MENU DATA

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

// =====================================================

// PROPS

// =====================================================

interface MenuControllerProps {

  menuItems: MenuItem[];

  onToggleAvailability: (itemId: string) => void;

  onUpdatePrice: (itemId: string, newPrice: number) => void;

  onAddMenuItem?: (data: AddMenuItemData) => Promise<void> | void;

  onEditMenuItem?: (data: EditMenuItemData) => Promise<void> | void;

}

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

  // ===================================================

  // SEARCH / FILTER

  // ===================================================

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  // ===================================================

  // PRICE EDIT

  // ===================================================

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  const [tempPrice, setTempPrice] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ===================================================
  // EDIT MENU
  // ===================================================

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

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

  // ===================================================

  // ADD MENU

  // ===================================================

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

  // ===================================================

  // REAL DATA CATEGORIES

  // ===================================================

  const categories = useMemo(() => {

    const uniqueCategories = Array.from(

      new Set(

        menuItems

          .map((item) => String(item.category || "").trim())

          .filter(Boolean)

      )

    );

    return ["all", ...uniqueCategories];

  }, [menuItems]);

  // ===================================================

  // FILTER MENU

  // ===================================================

  const filteredItems = menuItems.filter((item) => {

    const category = String(item.category || "");

    const name = String(item.name || "");

    const matchCategory =

      selectedCategory === "all" || category === selectedCategory;

    const query = search.toLowerCase().trim();

    const matchSearch =

      !query ||

      name.toLowerCase().includes(query) ||

      category.toLowerCase().includes(query);

    return matchCategory && matchSearch;

  });

  // ===================================================

  // PRICE SAVE

  // ===================================================

  const handleSavePrice = (itemId: string) => {

    const value = Number(tempPrice);

    if (Number.isFinite(value) && value > 0) {

      onUpdatePrice(itemId, value);

    }

    setEditingPriceId(null);

    setTempPrice("");

  };

  // ===================================================

  // ADD MENU FIELD CHANGE

  // ===================================================

  const handleNewMenuChange = (field: string, value: string | boolean) => {

    setNewMenu((prev) => ({

      ...prev,

      [field]: value,

    }));

  };

  // ===================================================

  // RESET ADD MENU

  // ===================================================

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

  };

  // ===================================================

  // ADD MENU SUBMIT

  // ===================================================

  const handleAddMenuSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!onAddMenuItem) {

      alert("Add Menu functionality is not connected.");

      return;

    }

    const name = newMenu.name.trim();

    const description = newMenu.description.trim();

    const image = newMenu.image.trim();

    const restaurantId = newMenu.restaurantId.trim();

    const categoryId = newMenu.categoryId.trim();

    const price = Number(newMenu.price);

    const prepTime = Number(newMenu.prepTime);

    // REQUIRED FIELDS

    if (!name || !description || !image || !restaurantId || !categoryId) {

      alert("Please fill all required fields.");

      return;

    }

    // PRICE VALIDATION

    if (!Number.isFinite(price) || price <= 0) {

      alert("Please enter a valid price.");

      return;

    }

    // PREP TIME VALIDATION

    if (!Number.isFinite(prepTime) || prepTime < 0) {

      alert("Please enter a valid preparation time.");

      return;

    }

    // PAYLOAD

    const payload: AddMenuItemData = {

      id: crypto.randomUUID(),

      name,

      description,

      price,

      veg: newMenu.veg,

      image,

      prepTime,

      restaurantId,

      categoryId,

      available: newMenu.available,

      popular: newMenu.popular,

      featured: newMenu.featured,

    };

    // API HANDLER

    try {

      setIsSubmitting(true);

      await onAddMenuItem(payload);

      resetNewMenu();

      setShowAddMenu(false);

    } catch (error) {

      console.error("Add menu item error:", error);

    } finally {

      setIsSubmitting(false);

    }

  };

  // ===================================================
  // EDIT MENU HANDLERS
  // ===================================================

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
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

    const payload: EditMenuItemData = {
      id: editingItem.id,
      name,
      description,
      price,
      veg: editMenu.veg,
      image,
      prepTime,
      categoryId,
      available: editMenu.available,
      popular: editMenu.popular,
      featured: editMenu.featured,
    };

    try {
      setIsEditSubmitting(true);
      await onEditMenuItem(payload);
      setEditingItem(null);
    } catch (error) {
      console.error("Edit menu item error:", error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // ===================================================

  // UI

  // ===================================================

  return (

    <div

      style={{

        width: "100%",

        boxSizing: "border-box",

      }}

    >

      {/* =================================================

          SEARCH + CATEGORY

      ================================================= */}

      <div

        style={{

          background: "#fffdf9",

          border: "1px solid rgba(59,36,24,0.055)",

          borderRadius: "14px",

          padding: "12px",

          marginBottom: "12px",

          boxShadow: "0 4px 16px rgba(59,36,24,0.035)",

        }}

      >
          {/* ADD MENU BUTTON */}
           <button

          type="button"

          onClick={() => setShowAddMenu(true)}

          style={{

            marginLeft: "auto",

            display: "inline-flex",

            alignItems: "center",

            justifyContent: "center",

            gap: "8px",

            height: "42px",

            padding: "0 18px",

            border: "none",

            borderRadius: "11px",

            background: "linear-gradient(135deg,#d62300 0%,#b91c00 100%)",

            color: "#fff",

            fontSize: "12px",

            fontWeight: 900,

            cursor: "pointer",

            boxShadow: "0 6px 16px rgba(214,35,0,0.22)",

            whiteSpace: "nowrap",

          }}

        >

          <Plus size={17} strokeWidth={2.8} />

          Add Menu Item

        </button>


        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: "10px",

            flexWrap: "wrap",

          }}

        >

          {/* SEARCH */}

          <div

            style={{

              flex: 1,

              minWidth: "220px",

              height: "40px",

              display: "flex",

              alignItems: "center",

              gap: "8px",

              padding: "0 11px",

              background: "#fffaf5",

              border: "1px solid rgba(59,36,24,0.08)",

              borderRadius: "10px",

              boxSizing: "border-box",

            }}

          >

            <Search size={17} color="#806c61" />

            <input

              type="text"

              placeholder="Search menu items..."

              value={search}

              onChange={(e) => setSearch(e.target.value)}

              style={{

                flex: 1,

                minWidth: 0,

                border: "none",

                outline: "none",

                background: "transparent",

                color: "#24120d",

                fontSize: "12px",

              }}

            />

          </div>

          {/* CATEGORIES */}

          <div

            style={{

              display: "flex",

              gap: "6px",

              overflowX: "auto",

              paddingBottom: "2px",

            }}

          >

            {categories.map((category) => {

              const active = selectedCategory === category;

              return (

                <button

                  key={category}

                  type="button"

                  onClick={() => setSelectedCategory(category)}

                  style={{

                    height: "34px",

                    padding: "0 11px",

                    flexShrink: 0,

                    border: active

                      ? "1px solid #d62300"

                      : "1px solid rgba(59,36,24,0.07)",

                    borderRadius: "9px",

                    background: active ? "#d62300" : "#fffaf5",

                    color: active ? "#fff" : "#5d463b",

                    fontSize: "10px",

                    fontWeight: 900,

                    cursor: "pointer",

                  }}

                >

                  {category === "all" ? "ALL" : category.toUpperCase()}

                </button>

              );

            })}

          </div>

        </div>

      </div>

      {/* =================================================

          ADD MENU MODAL

      ================================================= */}

      {showAddMenu && (

        <div

          style={{

            position: "fixed",

            inset: 0,

            zIndex: 9999,

            background: "rgba(24,12,7,0.55)",

            backdropFilter: "blur(5px)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            padding: "20px",

          }}

          onMouseDown={(e) => {

            if (e.target === e.currentTarget) {

              setShowAddMenu(false);

            }

          }}

        >

          <form

            onSubmit={handleAddMenuSubmit}

            style={{

              width: "100%",

              maxWidth: "720px",

              maxHeight: "90vh",

              overflowY: "auto",

              background: "#fffdf9",

              borderRadius: "18px",

              boxShadow: "0 24px 70px rgba(0,0,0,0.25)",

              padding: "22px",

              boxSizing: "border-box",

            }}

          >

            {/* MODAL HEADER */}

            <div

              style={{

                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                marginBottom: "20px",

              }}

            >

              <div>

                <h3

                  style={{

                    margin: 0,

                    fontSize: "20px",

                    fontWeight: 900,

                    color: "#24120d",

                  }}

                >

                  Add Menu Item

                </h3>

                <p

                  style={{

                    margin: "5px 0 0",

                    fontSize: "11px",

                    color: "#806c61",

                  }}

                >

                  Add a new food item to the menu

                </p>

              </div>

              <button

                type="button"

                onClick={() => setShowAddMenu(false)}

                style={{

                  width: "34px",

                  height: "34px",

                  border: "none",

                  borderRadius: "9px",

                  background: "#f7eee5",

                  color: "#6d5143",

                  display: "grid",

                  placeItems: "center",

                  cursor: "pointer",

                }}

              >

                <X size={18} />

              </button>

            </div>

            {/* FORM */}

            <div

              className="menu-add-form-grid"

              style={{

                display: "grid",

                gridTemplateColumns: "repeat(2,minmax(0,1fr))",

                gap: "14px",

              }}

            >

              {/* NAME */}

              <div style={{ gridColumn: "1 / -1" }}>

                <label style={labelStyle}>Food Name *</label>

                <input

                  required

                  value={newMenu.name}

                  onChange={(e) => handleNewMenuChange("name", e.target.value)}

                  placeholder="e.g. Crispy Chicken Burger"

                  style={inputStyle}

                />

              </div>

              {/* DESCRIPTION */}

              <div style={{ gridColumn: "1 / -1" }}>

                <label style={labelStyle}>Description *</label>

                <textarea

                  required

                  rows={3}

                  value={newMenu.description}

                  onChange={(e) =>

                    handleNewMenuChange("description", e.target.value)

                  }

                  placeholder="Enter food description"

                  style={{

                    ...inputStyle,

                    height: "auto",

                    padding: "11px 12px",

                    resize: "vertical",

                  }}

                />

              </div>

              {/* PRICE */}

              <div>

                <label style={labelStyle}>Price *</label>

                <input

                  required

                  type="number"

                  min="0.01"

                  step="0.01"

                  value={newMenu.price}

                  onChange={(e) => handleNewMenuChange("price", e.target.value)}

                  placeholder="299"

                  style={inputStyle}

                />

              </div>

              {/* PREP TIME */}

              <div>

                <label style={labelStyle}>Preparation Time (minutes) *</label>

                <input

                  required

                  type="number"

                  min="0"

                  value={newMenu.prepTime}

                  onChange={(e) =>

                    handleNewMenuChange("prepTime", e.target.value)

                  }

                  placeholder="15"

                  style={inputStyle}

                />

              </div>

              {/* VEG */}

              <div>

                <label style={labelStyle}>Food Type *</label>

                <select

                  value={newMenu.veg}

                  onChange={(e) =>

                    handleNewMenuChange(

                      "veg",

                      e.target.value as "VEG" | "NON_VEG"

                    )

                  }

                  style={inputStyle}

                >

                  <option value="VEG">VEG</option>

                  <option value="NON_VEG">NON VEG</option>

                </select>

              </div>

              {/* IMAGE */}

              <div>

                <label style={labelStyle}>Image URL *</label>

                <input

                  required

                  type="url"

                  value={newMenu.image}

                  onChange={(e) => handleNewMenuChange("image", e.target.value)}

                  placeholder="https://..."

                  style={inputStyle}

                />

              </div>

              {/* RESTAURANT */}

              <div>

                <label style={labelStyle}>Restaurant ID *</label>

                <input

                  required

                  value={newMenu.restaurantId}

                  onChange={(e) =>

                    handleNewMenuChange("restaurantId", e.target.value)

                  }

                  placeholder="Restaurant ID"

                  style={inputStyle}

                />

              </div>

              {/* CATEGORY */}

              <div>

                <label style={labelStyle}>Category ID *</label>

                <input

                  required

                  value={newMenu.categoryId}

                  onChange={(e) =>

                    handleNewMenuChange("categoryId", e.target.value)

                  }

                  placeholder="Category ID"

                  style={inputStyle}

                />

              </div>

            </div>

            {/* OPTIONS */}

            <div

              className="menu-add-options"

              style={{

                marginTop: "18px",

                padding: "14px",

                borderRadius: "12px",

                background: "#f8eee4",

                display: "grid",

                gridTemplateColumns: "repeat(3,1fr)",

                gap: "10px",

              }}

            >

              <CheckBox

                label="Available"

                checked={newMenu.available}

                onChange={(value) => handleNewMenuChange("available", value)}

              />

              <CheckBox

                label="Popular"

                checked={newMenu.popular}

                onChange={(value) => handleNewMenuChange("popular", value)}

              />

              <CheckBox

                label="Featured"

                checked={newMenu.featured}

                onChange={(value) => handleNewMenuChange("featured", value)}

              />

            </div>

            {/* ACTIONS */}

            <div

              style={{

                display: "flex",

                justifyContent: "flex-end",

                gap: "10px",

                marginTop: "20px",

              }}

            >

              <button

                type="button"

                onClick={() => setShowAddMenu(false)}

                style={{

                  height: "42px",

                  padding: "0 18px",

                  border: "1px solid rgba(59,36,24,0.12)",

                  borderRadius: "10px",

                  background: "#fffaf5",

                  color: "#5d463b",

                  fontSize: "12px",

                  fontWeight: 900,

                  cursor: "pointer",

                }}

              >

                Cancel

              </button>

              <button

                type="submit"

                disabled={isSubmitting}

                style={{

                  height: "42px",

                  padding: "0 20px",

                  border: "none",

                  borderRadius: "10px",

                  background: isSubmitting ? "#9b7568" : "#d62300",

                  color: "#fff",

                  fontSize: "12px",

                  fontWeight: 900,

                  cursor: isSubmitting ? "not-allowed" : "pointer",

                }}

              >

                {isSubmitting ? "Adding..." : "Add Menu Item"}

              </button>

            </div>

          </form>

        </div>

      )}

      {/* =================================================

          MENU TABLE

      ================================================= */}

      <div

        style={{

          background: "#fffdf9",

          border: "1px solid rgba(59,36,24,0.055)",

          borderRadius: "14px",

          overflow: "hidden",

          boxShadow: "0 4px 16px rgba(59,36,24,0.035)",

        }}

      >

        {/* TABLE HEADER */}

        <div

          className="menu-mobile-row"

          style={{

            display: "grid",

            gridTemplateColumns: "minmax(280px,2fr) 1fr 110px 145px",

            gap: "12px",

            padding: "10px 14px",

            background: "#f8eee4",

            color: "#806c61",

            fontSize: "10px",

            fontWeight: 900,

            textTransform: "uppercase",

            letterSpacing: "0.4px",

          }}

        >

          <span>Dish / Item</span>

          <span>Category</span>

          <span>Price</span>

          <span>Availability</span>

        </div>

        {/* MENU ITEMS */}

        <div>

          {filteredItems.length === 0 ? (

            <div

              style={{

                padding: "35px 20px",

                textAlign: "center",

                color: "#806c61",

                fontSize: "12px",

              }}

            >

              No menu items found.

            </div>

          ) : (

            filteredItems.map((item) => {

              const isAvailable = item.isAvailable !== false;

              return (

                <div

                  key={item.id}

                  className="menu-mobile-row"

                  style={{

                    display: "grid",

                    gridTemplateColumns: "minmax(280px,2fr) 1fr 110px 145px",

                    gap: "12px",

                    alignItems: "center",

                    padding: "10px 14px",

                    borderBottom: "1px solid rgba(59,36,24,0.045)",

                    opacity: isAvailable ? 1 : 0.62,

                  }}

                >

                  {/* ITEM */}

                  <div

                    style={{

                      display: "flex",

                      alignItems: "center",

                      gap: "10px",

                      minWidth: 0,

                    }}

                  >

                    {item.image ? (

                      <img

                        src={item.image}

                        alt={item.name}

                        style={{

                          width: "48px",

                          height: "48px",

                          flexShrink: 0,

                          objectFit: "cover",

                          borderRadius: "9px",

                          background: "#f1e5d9",

                        }}

                      />

                    ) : (

                      <div

                        style={{

                          width: "48px",

                          height: "48px",

                          flexShrink: 0,

                          borderRadius: "9px",

                          background: "#f1e5d9",

                          color: "#d62300",

                          display: "grid",

                          placeItems: "center",

                        }}

                      >

                        <Utensils size={19} />

                      </div>

                    )}

                    <div style={{ minWidth: 0 }}>

                      {/* FOOD NAME */}

                      <div

                        style={{

                          display: "flex",

                          alignItems: "center",

                          gap: "6px",

                          fontSize: "12px",

                          fontWeight: 900,

                          color: "#24120d",

                        }}

                      >

                        {/* VEG / NON VEG */}

                        <span

                          style={{

                            width: "12px",

                            height: "12px",

                            border:

                              item.dietary === "veg" ||

                              item.dietary === "vegan"

                                ? "1px solid #509e2f"

                                : "1px solid #d62300",

                            display: "grid",

                            placeItems: "center",

                            flexShrink: 0,

                          }}

                        >

                          <span

                            style={{

                              width: "5px",

                              height: "5px",

                              borderRadius: "50%",

                              background:

                                item.dietary === "veg" ||

                                item.dietary === "vegan"

                                  ? "#509e2f"

                                  : "#d62300",

                            }}

                          />

                        </span>

                        <span

                          style={{

                            overflow: "hidden",

                            textOverflow: "ellipsis",

                            whiteSpace: "nowrap",

                          }}

                        >

                          {item.name}

                        </span>

                      </div>

                      {/* RATING */}

                      <div

                        style={{

                          marginTop: "4px",

                          fontSize: "10px",

                          color: "#806c61",

                        }}

                      >

                        ⭐ {item.rating ?? "N/A"}

                        {item.ratingCount ? ` (${item.ratingCount})` : ""}

                      </div>

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <span

                      style={{

                        display: "inline-block",

                        padding: "5px 8px",

                        borderRadius: "7px",

                        background: "#f7eee5",

                        color: "#6d5143",

                        fontSize: "9px",

                        fontWeight: 900,

                        textTransform: "uppercase",

                      }}

                    >

                      {String(item.category || "—")}

                    </span>

                  </div>

                  {/* PRICE */}

                  <div>

                    {editingPriceId === item.id ? (

                      <div

                        style={{

                          display: "flex",

                          alignItems: "center",

                          gap: "4px",

                        }}

                      >

                        <span

                          style={{

                            fontWeight: 900,

                            color: "#d62300",

                            fontSize: "12px",

                          }}

                        >

                          ₹

                        </span>

                        <input

                          type="number"

                          min="0"

                          step="0.01"

                          value={tempPrice}

                          onChange={(e) => setTempPrice(e.target.value)}

                          onKeyDown={(e) => {

                            if (e.key === "Enter") {

                              handleSavePrice(item.id);

                            }

                            if (e.key === "Escape") {

                              setEditingPriceId(null);

                              setTempPrice("");

                            }

                          }}

                          autoFocus

                          style={{

                            width: "68px",

                            height: "30px",

                            padding: "0 7px",

                            border: "1px solid #d62300",

                            borderRadius: "7px",

                            outline: "none",

                            background: "#fffaf5",

                            color: "#24120d",

                            fontSize: "11px",

                            fontWeight: 800,

                          }}

                        />

                        <button

                          type="button"

                          onClick={() => handleSavePrice(item.id)}

                          style={{

                            width: "30px",

                            height: "30px",

                            border: "none",

                            borderRadius: "7px",

                            background: "#d62300",

                            color: "#fff",

                            display: "grid",

                            placeItems: "center",

                            cursor: "pointer",

                          }}

                        >

                          <Check size={14} />

                        </button>

                      </div>

                    ) : (

                      <div

                        onClick={() => {

                          setEditingPriceId(item.id);

                          setTempPrice(String(item.price ?? ""));

                        }}

                        title="Click to edit price"

                        style={{

                          cursor: "pointer",

                          fontWeight: 900,

                          color: "#d62300",

                          fontSize: "13px",

                        }}

                      >

                        ₹{Number(item.price || 0).toFixed(2)}

                      </div>

                    )}

                  </div>

                  {/* AVAILABILITY */}

                  <div

                    style={{

                      position: "relative",

                      display: "flex",

                      alignItems: "center",

                      gap: "7px",

                    }}

                  >

                    <button

                      type="button"

                      onClick={() => onToggleAvailability(item.id)}

                      style={{

                        height: "32px",

                        padding: "0 9px",

                        borderRadius: "8px",

                        border: isAvailable

                          ? "1px solid rgba(80,158,47,0.18)"

                          : "1px solid rgba(214,35,0,0.15)",

                        background: isAvailable ? "#edf7e9" : "#fff0eb",

                        color: isAvailable ? "#509e2f" : "#d62300",

                        display: "inline-flex",

                        alignItems: "center",

                        gap: "5px",

                        fontSize: "9px",

                        fontWeight: 900,

                        cursor: "pointer",

                      }}

                    >

                      {isAvailable ? (

                        <>

                          <ToggleRight size={17} />

                          IN STOCK

                        </>

                      ) : (

                        <>

                          <ToggleLeft size={17} />

                          SOLD OUT

                        </>

                      )}

                    </button>

                    <button

                      type="button"

                      onClick={() =>

                        setOpenMenuId(openMenuId === item.id ? null : item.id)

                      }

                      title="More options"

                      style={{

                        width: "32px",

                        height: "32px",

                        border: "1px solid rgba(59,36,24,0.08)",

                        borderRadius: "8px",

                        background: "#fffaf5",

                        color: "#5d463b",

                        display: "grid",

                        placeItems: "center",

                        cursor: "pointer",

                        flexShrink: 0,

                      }}

                    >

                      <MoreVertical size={17} />

                    </button>

                    {openMenuId === item.id && (

                      <div

                        style={{

                          position: "absolute",

                          right: 0,

                          top: "39px",

                          zIndex: 100,

                          minWidth: "110px",

                          padding: "5px",

                          background: "#ffffff",

                          border: "1px solid rgba(59,36,24,0.08)",

                          borderRadius: "9px",

                          boxShadow: "0 10px 25px rgba(0,0,0,0.14)",

                        }}

                      >

                        <button

                          type="button"

                          onClick={() => handleEditClick(item)}

                          style={{

                            width: "100%",

                            border: "none",

                            background: "transparent",

                            padding: "9px 10px",

                            textAlign: "left",

                            borderRadius: "7px",

                            color: "#24120d",

                            fontSize: "11px",

                            fontWeight: 800,

                            cursor: "pointer",

                          }}

                        >

                          Edit

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );

            })

          )}

        </div>

      </div>

      {/* =================================================
          EDIT MENU MODAL
      ================================================= */}

      {editingItem && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(24,12,7,0.55)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setEditingItem(null); }}
        >
          <form onSubmit={handleEditMenuSubmit} style={{ width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto", background: "#fffdf9", borderRadius: "18px", boxShadow: "0 24px 70px rgba(0,0,0,0.25)", padding: "22px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 900, color: "#24120d" }}>Edit Menu Item</h3>
                <p style={{ margin: "5px 0 0", fontSize: "11px", color: "#806c61" }}>Update selected food item</p>
              </div>
              <button type="button" onClick={() => setEditingItem(null)} style={{ width: "34px", height: "34px", border: "none", borderRadius: "9px", background: "#f7eee5", color: "#6d5143", display: "grid", placeItems: "center", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div className="menu-add-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "14px" }}>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Food Name *</label><input required value={editMenu.name} onChange={(e) => handleEditMenuChange("name", e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Description *</label><textarea required rows={3} value={editMenu.description} onChange={(e) => handleEditMenuChange("description", e.target.value)} style={{ ...inputStyle, height: "auto", padding: "11px 12px", resize: "vertical" }} /></div>
              <div><label style={labelStyle}>Price *</label><input required type="number" min="0.01" step="0.01" value={editMenu.price} onChange={(e) => handleEditMenuChange("price", e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Preparation Time (minutes) *</label><input required type="number" min="0" value={editMenu.prepTime} onChange={(e) => handleEditMenuChange("prepTime", e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Food Type *</label><select value={editMenu.veg} onChange={(e) => handleEditMenuChange("veg", e.target.value as "VEG" | "NON_VEG")} style={inputStyle}><option value="VEG">VEG</option><option value="NON_VEG">NON VEG</option></select></div>
              <div><label style={labelStyle}>Image URL *</label><input required type="url" value={editMenu.image} onChange={(e) => handleEditMenuChange("image", e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Category ID *</label><input required value={editMenu.categoryId} onChange={(e) => handleEditMenuChange("categoryId", e.target.value)} style={inputStyle} /></div>
            </div>

            <div className="menu-add-options" style={{ marginTop: "18px", padding: "14px", borderRadius: "12px", background: "#f8eee4", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
              <CheckBox label="Available" checked={editMenu.available} onChange={(value) => handleEditMenuChange("available", value)} />
              <CheckBox label="Popular" checked={editMenu.popular} onChange={(value) => handleEditMenuChange("popular", value)} />
              <CheckBox label="Featured" checked={editMenu.featured} onChange={(value) => handleEditMenuChange("featured", value)} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button type="button" onClick={() => setEditingItem(null)} style={{ height: "42px", padding: "0 18px", border: "1px solid rgba(59,36,24,0.12)", borderRadius: "10px", background: "#fffaf5", color: "#5d463b", fontSize: "12px", fontWeight: 900, cursor: "pointer" }}>Cancel</button>
              <button type="submit" disabled={isEditSubmitting} style={{ height: "42px", padding: "0 20px", border: "none", borderRadius: "10px", background: isEditSubmitting ? "#9b7568" : "#d62300", color: "#fff", fontSize: "12px", fontWeight: 900, cursor: isEditSubmitting ? "not-allowed" : "pointer" }}>{isEditSubmitting ? "Saving..." : "Save Changes"}</button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================

          RESPONSIVE CSS

      ================================================= */}

      <style>

        {`

          @media (max-width: 850px) {

            .menu-mobile-row {

              grid-template-columns: 1fr !important;

            }

          }

          @media (max-width: 600px) {

            .menu-add-form-grid {

              grid-template-columns: 1fr !important;

            }

            .menu-add-options {

              grid-template-columns: 1fr !important;

            }

          }

        `}

      </style>

    </div>

  );

};

// =====================================================

// FORM STYLES

// =====================================================

const labelStyle: React.CSSProperties = {

  display: "block",

  marginBottom: "6px",

  fontSize: "10px",

  fontWeight: 900,

  color: "#5d463b",

};

const inputStyle: React.CSSProperties = {

  width: "100%",

  height: "40px",

  boxSizing: "border-box",

  padding: "0 11px",

  border: "1px solid rgba(59,36,24,0.10)",

  borderRadius: "9px",

  outline: "none",

  background: "#fffaf5",

  color: "#24120d",

  fontSize: "12px",

  fontWeight: 600,

};

// =====================================================

// CHECKBOX

// =====================================================

interface CheckBoxProps {

  label: string;

  checked: boolean;

  onChange: (value: boolean) => void;

}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onChange }) => {

  return (

    <label

      style={{

        display: "flex",

        alignItems: "center",

        gap: "8px",

        cursor: "pointer",

        fontSize: "11px",

        fontWeight: 800,

        color: "#5d463b",

      }}

    >

      <input

        type="checkbox"

        checked={checked}

        onChange={(e) => onChange(e.target.checked)}

        style={{

          width: "16px",

          height: "16px",

          accentColor: "#d62300",

          cursor: "pointer",

        }}

      />

      {label}

    </label>

  );

};