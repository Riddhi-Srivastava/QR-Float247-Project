import React, { useEffect, useRef, useState } from 'react';
import {
  Grid2X2,
  Leaf,
  Drumstick,
  Crown,
  Coffee,
  Wheat,
  IceCream,
  UtensilsCrossed,
  Soup,
  Salad,
  Sparkles,
} from 'lucide-react';

import api from '../../lib/api';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;

  dietaryFilter: 'all' | 'veg' | 'non-veg' | 'specials';
  setDietaryFilter: (
    filter: 'all' | 'veg' | 'non-veg' | 'specials'
  ) => void;
}

interface BackendCategory {
  id: string;
  name: string;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  dietaryFilter,
  setDietaryFilter,
}) => {
  const [categories, setCategories] = useState<
    BackendCategory[]
  >([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* =========================================================
    EXISTING CATEGORY API
    ========================================================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');

        const backendCategories =
          response.data?.categories || [];

        setCategories(backendCategories);
      } catch (error) {
        console.error(
          'Failed to load categories:',
          error
        );
      }
    };

    loadCategories();
  }, []);

  /* =========================================================
    CATEGORY NAME HELPER
    ========================================================= */

  const getCategoryId = (
    possibleNames: string[],
    fallback: string
  ) => {
    const match = categories.find(category =>
      possibleNames.some(
        name =>
          category.name.toLowerCase().trim() ===
          name.toLowerCase().trim()
      )
    );

    return match?.id || fallback;
  };

  /* =========================================================
    CATEGORY DATA
    ========================================================= */

  const categoryItems: CategoryItem[] = [
    {
      id: getCategoryId(['starters'], 'starters'),
      name: 'Starters',
      icon: <Salad size={19} strokeWidth={2.2} />,
    },
    {
      id: getCategoryId(
        ['main course', 'mains', 'main'],
        'mains'
      ),
      name: 'Main Course',
      icon: <UtensilsCrossed size={19} strokeWidth={2.2} />,
    },
    {
      id: getCategoryId(
        ['breads', 'bread'],
        'breads'
      ),
      name: 'Breads',
      icon: <Wheat size={19} strokeWidth={2.2} />,
    },
    {
      id: getCategoryId(
        ['rice & biryani', 'rice', 'biryani'],
        'rice'
      ),
      name: 'Rice & Biryani',
      icon: <Soup size={19} strokeWidth={2.2} />,
    },
    {
      id: getCategoryId(
        ['beverages', 'drinks', 'drink'],
        'drinks'
      ),
      name: 'Beverages',
      icon: <Coffee size={19} strokeWidth={2.2} />,
    },
    {
      id: getCategoryId(
        ['desserts', 'dessert'],
        'desserts'
      ),
      name: 'Desserts',
      icon: <IceCream size={19} strokeWidth={2.2} />,
    },
  ];

  /* =========================================================
    ACTIONS
    ========================================================= */

  const handleAllItems = () => {
    onSelectCategory('all');
    setDietaryFilter('all');
  };

  const handleVeg = () => {
    onSelectCategory('all');
    setDietaryFilter('veg');
  };

  const handleNonVeg = () => {
    onSelectCategory('all');
    setDietaryFilter('non-veg');
  };

  const handleBestsellers = () => {
    onSelectCategory('all');
    setDietaryFilter('specials');
  };

  const handleCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
    setDietaryFilter('all');
  };

  return (
    <section className="float-category-section">
      <div className="float-category-shell">

        {/* ===================================================
                TOP FILTER ROW
            =================================================== */}

        <div className="float-filter-row">

          {/* ALL ITEMS */}
          <button
            type="button"
            className={`float-filter-pill ${dietaryFilter === 'all' &&
              selectedCategory === 'all'
              ? 'is-active'
              : ''
              }`}
            onClick={handleAllItems}
          >
            <span className="float-pill-icon all-icon">
              <Grid2X2 size={19} strokeWidth={2.5} />
            </span>

            <span>All Items</span>
          </button>

          {/* VEG */}
          <button
            type="button"
            className={`float-filter-pill ${dietaryFilter === 'veg'
              ? 'is-active veg-active'
              : ''
              }`}
            onClick={handleVeg}
          >
            <span className="float-pill-icon veg-icon">
              <Leaf size={19} strokeWidth={2.5} />
            </span>

            <span>Veg Only</span>
          </button>

          {/* NON VEG */}
          <button
            type="button"
            className={`float-filter-pill ${dietaryFilter === 'non-veg'
              ? 'is-active nonveg-active'
              : ''
              }`}
            onClick={handleNonVeg}
          >
            <span className="float-pill-icon nonveg-icon">
              <Drumstick
                size={18}
                strokeWidth={2.5}
              />
            </span>

            <span>Non-Veg</span>
          </button>

          {/* BESTSELLERS */}
          <button
            type="button"
            className={`float-filter-pill ${dietaryFilter === 'specials'
              ? 'is-active bestseller-active'
              : ''
              }`}
            onClick={handleBestsellers}
          >
            <span className="float-pill-icon crown-icon">
              <Crown size={19} strokeWidth={2.3} />
            </span>

            <span>King's Bestsellers</span>

            <span className="hot-mini-badge">
              HOT
            </span>
          </button>
        </div>

        {/* ===================================================
                CATEGORY ROW
            =================================================== */}

        <div
          className="float-category-scroll"
          ref={scrollRef}
        >
          <div className="float-category-track">

            {categoryItems.map(category => {
              const isActive =
                selectedCategory === category.id &&
                dietaryFilter === 'all';

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`float-category-pill ${isActive ? 'is-category-active' : ''
                    }`}
                  onClick={() =>
                    handleCategory(category.id)
                  }
                >
                  <span className="float-category-icon">
                    {category.icon}
                  </span>

                  <span className="float-category-label">
                    {category.name}
                  </span>
                </button>
              );
            })}

            {/* FULL MENU */}
            <button
              type="button"
              className={`float-category-pill full-menu-pill ${selectedCategory === 'all' &&
                dietaryFilter === 'all'
                ? 'is-category-active'
                : ''
                }`}
              onClick={handleAllItems}
            >
              <span className="float-category-icon">
                <UtensilsCrossed
                  size={20}
                  strokeWidth={2.3}
                />
              </span>

              <span className="float-category-label">
                Full Menu
              </span>

              <Sparkles
                className="full-menu-spark"
                size={13}
              />
            </button>
          </div>
        </div>

        {/* ===================================================
                DECORATIVE ACCENT
            =================================================== */}

        <div className="category-glow glow-one" />
        <div className="category-glow glow-two" />

      </div>

      <style>{`
            /* =====================================================
              FLOAT247 CATEGORY NAV
              iOS / APPLE INSPIRED GEOMETRY
            ===================================================== */

            /* CHANGED: section now owns the side margins so the box
              sits centered and aligned on every screen size */
            .float-category-section {
              width: 100%;
              box-sizing: border-box;
              padding: 14px 16px 16px;
              position: relative;
              z-index: 10;
            }

            /* CHANGED: fixed width/centering, softer border */
            .float-category-shell {
              width: 100%;
              max-width: 1380px;
              box-sizing: border-box;

              margin: 0 auto;

              position: relative;

              padding: 12px;

              border-radius: 28px;

              background:
                linear-gradient(
                  145deg,
                  rgba(255,255,255,0.98),
                  rgba(255,247,250,0.96)
                );

              border:
                1px solid
                rgba(255,36,87,0.06);

              box-shadow:
                0 12px 35px
                  rgba(31,31,31,0.06),
                inset 0 1px 0
                  rgba(255,255,255,0.95);

              overflow: hidden;
            }

            /* subtle glass highlight */

            .float-category-shell::before {
              content: '';

              position: absolute;

              top: -80px;
              right: 7%;

              width: 260px;
              height: 150px;

              border-radius: 50%;

              background:
                radial-gradient(
                  circle,
                  rgba(255,36,87,0.12),
                  transparent 70%
                );

              pointer-events: none;
            }

            /* =====================================================
              FILTER ROW
            ===================================================== */

            .float-filter-row {
              position: relative;
              z-index: 2;

              display: flex;

              align-items: center;

              gap: 10px;

              overflow-x: auto;

              scrollbar-width: none;

              padding:
                1px 2px 9px;
            }

            .float-filter-row::-webkit-scrollbar {
              display: none;
            }

            /* =====================================================
              TOP PILLS
            ===================================================== */

            .float-filter-pill {
              position: relative;

              flex: 0 0 auto;

              min-height: 48px;

              padding:
                8px 17px;

              border-radius: 17px;

              border:
                1px solid #E7E7EB;

              background: #FFFFFF;

              color: #555555;

              display: inline-flex;

              align-items: center;

              justify-content: center;

              gap: 8px;

              font-family:
                var(--font-heading),
                'Fredoka',
                'Outfit',
                sans-serif;

              font-size: 14px;

              font-weight: 800;

              letter-spacing: -0.15px;

              cursor: pointer;

              white-space: nowrap;

              box-shadow:
                0 3px 10px
                  rgba(31,31,31,0.045);

              transition:
                transform 180ms ease,
                box-shadow 180ms ease,
                border-color 180ms ease,
                background 180ms ease,
                color 180ms ease;
            }

            .float-filter-pill:hover {
              transform:
                translateY(-2px);

              border-color:
                rgba(255,36,87,0.20);

              box-shadow:
                0 7px 18px
                  rgba(255,36,87,0.10);
            }

            .float-filter-pill:active {
              transform:
                scale(0.97);
            }

            .float-filter-pill.is-active {
              background:
                linear-gradient(
                  135deg,
                  #FF2457,
                  #FF4F78
                );

              color: #FFFFFF;

              border-color:
                transparent;

              box-shadow:
                0 9px 22px
                  rgba(255,36,87,0.28),
                inset 0 1px 0
                  rgba(255,255,255,0.30);
            }

            .float-filter-pill.is-active::after {
              content: '';

              position: absolute;

              inset: 2px;

              border-radius: 15px;

              border:
                1px solid
                rgba(255,255,255,0.16);

              pointer-events: none;
            }

            /* =====================================================
              ICON CIRCLES
            ===================================================== */

            .float-pill-icon {
              width: 29px;
              height: 29px;

              display: inline-flex;

              align-items: center;
              justify-content: center;

              border-radius: 10px;

              flex-shrink: 0;

              background: #F7F7F9;
            }

            .is-active .float-pill-icon {
              background:
                rgba(255,255,255,0.18);

              color: #FFFFFF;
            }

            .all-icon {
              color: #FF2457;
            }

            .veg-icon {
              color: #16834B;

              background: #EAF8F0;
            }

            .nonveg-icon {
              color: #D62300;

              background: #FFF0ED;
            }

            .crown-icon {
              color: #D88A00;

              background: #FFF5D9;
            }

            .hot-mini-badge {
              margin-left: 1px;

              padding:
                3px 7px;

              border-radius: 999px;

              background:
                #FFF0F4;

              color:
                #FF2457;

              font-size: 8px;

              font-weight: 900;

              letter-spacing: .4px;
            }

            .is-active .hot-mini-badge {
              background:
                rgba(255,255,255,0.18);

              color: #FFFFFF;
            }

            /* =====================================================
              CATEGORY SCROLL
            ===================================================== */

            .float-category-scroll {
              position: relative;

              z-index: 2;

              overflow-x: auto;

              scrollbar-width: none;

              padding:
                2px 2px 4px;
            }

            .float-category-scroll::-webkit-scrollbar {
              display: none;
            }

            .float-category-track {
              display: flex;

              align-items: center;

              gap: 10px;

              min-width: max-content;
            }

            /* =====================================================
              CATEGORY PILL
            ===================================================== */

            .float-category-pill {
              position: relative;

              min-height: 52px;

              padding:
                8px 16px;

              border-radius: 18px;

              border:
                1px solid #E7E7EB;

              background:
                rgba(255,255,255,0.96);

              color: #555555;

              display: inline-flex;

              align-items: center;

              justify-content: center;

              gap: 8px;

              font-family:
                var(--font-heading),
                'Fredoka',
                'Outfit',
                sans-serif;

              font-size: 14px;

              font-weight: 800;

              white-space: nowrap;

              cursor: pointer;

              box-shadow:
                0 3px 10px
                  rgba(31,31,31,0.045);

              transition:
                transform 180ms ease,
                box-shadow 180ms ease,
                border-color 180ms ease,
                background 180ms ease,
                color 180ms ease;
            }

            .float-category-pill:hover {
              transform:
                translateY(-2px);

              border-color:
                rgba(255,36,87,0.22);

              box-shadow:
                0 8px 20px
                  rgba(255,36,87,0.10);
            }

            .float-category-pill:active {
              transform:
                scale(0.97);
            }

            .float-category-icon {
              width: 32px;
              height: 32px;

              border-radius: 11px;

              display: inline-flex;

              align-items: center;
              justify-content: center;

              background:
                #FFF1F5;

              color:
                #FF2457;

              flex-shrink: 0;

              transition:
                background 180ms ease,
                color 180ms ease;
            }

            .float-category-pill:nth-child(1)
            .float-category-icon {
              color: #D95C5C;
              background: #FFF0F0;
            }

            .float-category-pill:nth-child(2)
            .float-category-icon {
              color: #E58C22;
              background: #FFF5E6;
            }

            .float-category-pill:nth-child(3)
            .float-category-icon {
              color: #B77A39;
              background: #FFF5E8;
            }

            .float-category-pill:nth-child(4)
            .float-category-icon {
              color: #A86636;
              background: #FFF1E8;
            }

            .float-category-pill:nth-child(5)
            .float-category-icon {
              color: #E34D65;
              background: #FFF0F4;
            }

            .float-category-pill:nth-child(6)
            .float-category-icon {
              color: #C88B28;
              background: #FFF7DF;
            }

            /* =====================================================
              ACTIVE CATEGORY
            ===================================================== */

            .float-category-pill.is-category-active {
              background:
                linear-gradient(
                  135deg,
                  #FF2457,
                  #FF4F78
                );

              color: #FFFFFF;

              border-color:
                transparent;

              box-shadow:
                0 10px 24px
                  rgba(255,36,87,0.27),
                inset 0 1px 0
                  rgba(255,255,255,0.28);

              transform:
                translateY(-1px);
            }

            .float-category-pill.is-category-active
            .float-category-icon {
              color: #FFFFFF;

              background:
                rgba(255,255,255,0.17);
            }

            .full-menu-pill {
              min-width: 145px;
            }

            .full-menu-spark {
              position: absolute;

              top: 5px;
              right: 8px;

              color:
                rgba(255,255,255,0.85);
            }

            /* =====================================================
              DECORATIVE GLOW
            ===================================================== */

            .category-glow {
              position: absolute;

              border-radius: 50%;

              pointer-events: none;

              filter: blur(1px);
            }

            .glow-one {
              width: 90px;
              height: 90px;

              right: 16%;
              bottom: -45px;

              background:
                rgba(255,36,87,0.08);
            }

            .glow-two {
              width: 60px;
              height: 60px;

              left: 34%;
              top: -30px;

              background:
                rgba(255,79,120,0.07);
            }

            /* =====================================================
              MOBILE
            ===================================================== */

            @media (max-width: 768px) {
              /* CHANGED: side margins now come from the section */
              .float-category-section {
                padding: 12px 12px 14px;
              }

              .float-category-shell {
                padding: 9px;

                border-radius: 23px;
              }

              .float-filter-pill {
                min-height: 44px;

                padding:
                  7px 13px;

                border-radius: 15px;

                font-size: 13px;
              }

              .float-pill-icon {
                width: 27px;
                height: 27px;

                border-radius: 9px;
              }

              .float-category-pill {
                min-height: 48px;

                padding:
                  7px 13px;

                border-radius: 16px;

                font-size: 13px;
              }

              .float-category-icon {
                width: 29px;
                height: 29px;

                border-radius: 9px;
              }
            }

            @media (max-width: 480px) {
              /* CHANGED: equal side margins instead of 0 */
              .float-category-section {
                padding: 10px 10px 12px;
              }

              .float-category-shell {
                border-radius: 20px;

                padding: 8px;
              }

              .float-filter-row {
                gap: 7px;
              }

              .float-filter-pill {
                min-height: 42px;

                padding:
                  6px 11px;

                font-size: 12px;

                gap: 6px;
              }

              .float-filter-pill
              .hot-mini-badge {
                display: none;
              }

              .float-category-track {
                gap: 7px;
              }

              .float-category-pill {
                min-height: 46px;

                padding:
                  6px 11px;

                font-size: 12px;

                gap: 6px;
              }

              .full-menu-pill {
                min-width: 125px;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .float-filter-pill,
              .float-category-pill {
                transition: none;
              }
            }
          `}</style>
    </section>
  );
};

export default CategoryPills;