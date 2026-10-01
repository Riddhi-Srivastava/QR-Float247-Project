import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  image: string | null;
}

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  dietaryFilter: 'all' | 'veg' | 'non-veg' | 'specials';
  setDietaryFilter: (
    filter: 'all' | 'veg' | 'non-veg' | 'specials'
  ) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  dietaryFilter,
  setDietaryFilter
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div
      className="category-section"
      style={{
        marginTop: 0,
        paddingTop: 0
      }}
    >
      <div
        className="container"
        style={{
          marginTop: 0,
          paddingTop: 0
        }}
      >
        {/* Dietary Filters */}
        <div className="dietary-filter-bar">
          <button
            className={`filter-chip ${
              dietaryFilter === 'all' ? 'active' : ''
            }`}
            onClick={() => setDietaryFilter('all')}
          >
            All Items
          </button>

          <button
            className={`filter-chip ${
              dietaryFilter === 'veg' ? 'active' : ''
            }`}
            onClick={() =>
              setDietaryFilter(
                dietaryFilter === 'veg' ? 'all' : 'veg'
              )
            }
          >
            <span
              className="dietary-box dietary-veg"
              style={{
                width: '12px',
                height: '12px'
              }}
            >
              <span
                className="dietary-circle"
                style={{
                  width: '5px',
                  height: '5px'
                }}
              ></span>
            </span>

            <span>Veg Only</span>
          </button>

          <button
            className={`filter-chip ${
              dietaryFilter === 'non-veg' ? 'active' : ''
            }`}
            onClick={() =>
              setDietaryFilter(
                dietaryFilter === 'non-veg'
                  ? 'all'
                  : 'non-veg'
              )
            }
          >
            <span
              className="dietary-box dietary-nonveg"
              style={{
                width: '12px',
                height: '12px'
              }}
            >
              <span
                className="dietary-circle"
                style={{
                  width: '5px',
                  height: '5px'
                }}
              ></span>
            </span>

            <span>Non-Veg</span>
          </button>

          <button
            className={`filter-chip ${
              dietaryFilter === 'specials' ? 'active' : ''
            }`}
            onClick={() =>
              setDietaryFilter(
                dietaryFilter === 'specials'
                  ? 'all'
                  : 'specials'
              )
            }
          >
            <span>🔥 King's Bestsellers</span>
          </button>
        </div>

        {/* Horizontal Category Pill Carousel */}
        <div className="category-scroll-container">
          {categories.map(cat => {
            const isSelected =
              selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`category-pill ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() =>
                  onSelectCategory(cat.id)
                }
              >
                <span>
                  {cat.icon || '🍽️'}
                </span>

                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};