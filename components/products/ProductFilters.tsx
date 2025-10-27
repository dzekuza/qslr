"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import styles from "./ProductCatalog.module.css";

interface Category {
  name: string;
  count: number;
}

interface ProductFiltersProps {
  categories: Category[];
  availabilityOptions: string[];
  quickFilters: string[];
}

export function ProductFilters({ 
  categories, 
  availabilityOptions, 
  quickFilters 
}: ProductFiltersProps) {
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryName]);
    } else {
      setSelectedCategories(selectedCategories.filter(name => name !== categoryName));
    }
  };

  const handleQuickFilterChange = (filterName: string, checked: boolean) => {
    if (checked) {
      setSelectedQuickFilters([...selectedQuickFilters, filterName]);
    } else {
      setSelectedQuickFilters(selectedQuickFilters.filter(name => name !== filterName));
    }
  };

  return (
    <div className={styles.filterSidebar}>
      <h2 className="text-lg font-semibold text-black">Filters</h2>
      
      {/* Quick Filter Buttons */}
      <div className={styles.filterSection}>
        <div className={styles.quickFilterButtons}>
          {quickFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleQuickFilterChange(filter, !selectedQuickFilters.includes(filter))}
              className={`${styles.quickFilterButton} ${
                selectedQuickFilters.includes(filter) ? styles.active : ""
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Availability from:</h3>
        <RadioGroup 
          value={selectedAvailability} 
          onValueChange={setSelectedAvailability}
          className={styles.radioGroup}
        >
          {availabilityOptions.map((option) => (
            <div key={option} className={styles.radioItem}>
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className={styles.radioLabel}>
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Categories Filter */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Categories:</h3>
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <div key={category.name} className={styles.checkboxItem}>
              <Checkbox
                id={category.name}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.name, checked as boolean)
                }
              />
              <Label htmlFor={category.name} className={styles.checkboxLabel}>
                {category.name} ({category.count})
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
