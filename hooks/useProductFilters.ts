"use client";

import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  availability: string[];
  priceRange: { min: string; max: string };
  categories: string[];
  brands: string[];
  powerRange: { min: string; max: string };
  voltageRange: { min: string; max: string };
  efficiencyRange: { min: string; max: string };
  warrantyRange: { min: string; max: string };
  panelTypes: string[];
  certifications: string[];
  stockRange: { min: string; max: string };
  vendorCountries: string[];
  deliveryTime: string[];
  paymentMethods: string[];
  shippingOptions: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  wattage?: number;
  voltage?: number;
  efficiency?: number;
  warranty?: number;
  stock: number;
  panelType?: string;
  certification?: string[];
  vendor: {
    businessName: string;
    country?: string;
  };
  categories: Array<{ name: string }>;
}

const initialFilterState: FilterState = {
  availability: [],
  priceRange: { min: "", max: "" },
  categories: [],
  brands: [],
  powerRange: { min: "", max: "" },
  voltageRange: { min: "", max: "" },
  efficiencyRange: { min: "", max: "" },
  warrantyRange: { min: "", max: "" },
  panelTypes: [],
  certifications: [],
  stockRange: { min: "", max: "" },
  vendorCountries: [],
  deliveryTime: [],
  paymentMethods: [],
  shippingOptions: [],
};

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const handleCheckboxChange = useCallback((
    category: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...(prev[category] as string[]), value]
        : (prev[category] as string[]).filter(item => item !== value)
    }));
  }, []);

  const handleRangeChange = useCallback((
    category: keyof FilterState,
    field: 'min' | 'max',
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as { min: string; max: string }),
        [field]: value
      }
    }));
  }, []);

  const removeFilter = useCallback((category: keyof FilterState, value?: string) => {
    setFilters(prev => {
      if (value && Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: (prev[category] as string[]).filter(item => item !== value)
        };
      } else if (typeof prev[category] === 'object' && prev[category] !== null) {
        return {
          ...prev,
          [category]: { min: "", max: "" }
        };
      }
      return prev;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Availability filter
      if (filters.availability.length > 0) {
        const isInStock = product.stock > 0;
        const isLowStock = product.stock > 0 && product.stock <= 10;
        const isOutOfStock = product.stock === 0;
        
        const availabilityMatch = filters.availability.some(filter => {
          if (filter === 'in-stock') return isInStock;
          if (filter === 'low-stock') return isLowStock;
          if (filter === 'out-of-stock') return isOutOfStock;
          return false;
        });
        
        if (!availabilityMatch) return false;
      }

      // Price range filter
      if (filters.priceRange.min || filters.priceRange.max) {
        const price = product.price;
        const minPrice = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const maxPrice = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        
        if (price < minPrice || price > maxPrice) return false;
      }

      // Categories filter
      if (filters.categories.length > 0) {
        const productCategories = product.categories.map(cat => 
          cat.name.toLowerCase().replace(/\s+/g, '-')
        );
        const hasMatchingCategory = filters.categories.some(filter => 
          productCategories.includes(filter)
        );
        
        if (!hasMatchingCategory) return false;
      }

      // Brands filter (based on vendor business name)
      if (filters.brands.length > 0) {
        const vendorName = product.vendor.businessName.toLowerCase().replace(/\s+/g, '-');
        const hasMatchingBrand = filters.brands.some(brand => 
          vendorName.includes(brand.toLowerCase())
        );
        
        if (!hasMatchingBrand) return false;
      }

      // Power range filter
      if (filters.powerRange.min || filters.powerRange.max) {
        if (!product.wattage) return false;
        
        const wattage = product.wattage;
        const minPower = filters.powerRange.min ? parseFloat(filters.powerRange.min) : 0;
        const maxPower = filters.powerRange.max ? parseFloat(filters.powerRange.max) : Infinity;
        
        if (wattage < minPower || wattage > maxPower) return false;
      }

      // Stock range filter
      if (filters.stockRange.min || filters.stockRange.max) {
        const stock = product.stock;
        const minStock = filters.stockRange.min ? parseInt(filters.stockRange.min) : 0;
        const maxStock = filters.stockRange.max ? parseInt(filters.stockRange.max) : Infinity;
        
        if (stock < minStock || stock > maxStock) return false;
      }

      // Panel type filter
      if (filters.panelTypes.length > 0 && product.panelType) {
        const panelType = product.panelType.toLowerCase().replace(/\s+/g, '-');
        const hasMatchingPanelType = filters.panelTypes.some(type => 
          panelType.includes(type.toLowerCase())
        );
        
        if (!hasMatchingPanelType) return false;
      }

      return true;
    });
  }, [products, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    // Count array filters
    count += filters.availability.length;
    count += filters.categories.length;
    count += filters.brands.length;
    count += filters.deliveryTime.length;
    count += filters.paymentMethods.length;
    count += filters.shippingOptions.length;
    count += filters.panelTypes.length;
    count += filters.certifications.length;
    count += filters.vendorCountries.length;
    
    // Count range filters
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.powerRange.min || filters.powerRange.max) count++;
    if (filters.voltageRange.min || filters.voltageRange.max) count++;
    if (filters.efficiencyRange.min || filters.efficiencyRange.max) count++;
    if (filters.warrantyRange.min || filters.warrantyRange.max) count++;
    if (filters.stockRange.min || filters.stockRange.max) count++;
    
    return count;
  }, [filters]);

  return {
    filters,
    filteredProducts,
    activeFilterCount,
    handleCheckboxChange,
    handleRangeChange,
    removeFilter,
    clearAllFilters,
  };
}
