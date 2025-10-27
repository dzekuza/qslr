"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterSummaryProps {
  activeFilters: {
    availability: string[];
    priceRange: { min: string; max: string };
    categories: string[];
    brands: string[];
    powerRange: { min: string; max: string };
    stockRange: { min: string; max: string };
    deliveryTime: string[];
    paymentMethods: string[];
    shippingOptions: string[];
  };
  onRemoveFilter: (category: string, value?: string) => void;
  onClearAll: () => void;
}

export function FilterSummary({ activeFilters, onRemoveFilter, onClearAll }: FilterSummaryProps) {
  const getActiveFilterCount = () => {
    let count = 0;
    
    // Count array filters
    count += activeFilters.availability.length;
    count += activeFilters.categories.length;
    count += activeFilters.brands.length;
    count += activeFilters.deliveryTime.length;
    count += activeFilters.paymentMethods.length;
    count += activeFilters.shippingOptions.length;
    
    // Count range filters
    if (activeFilters.priceRange.min || activeFilters.priceRange.max) count++;
    if (activeFilters.powerRange.min || activeFilters.powerRange.max) count++;
    if (activeFilters.stockRange.min || activeFilters.stockRange.max) count++;
    
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
        {/* Availability filters */}
        {activeFilters.availability.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('availability', filter)}
            />
          </Badge>
        ))}
        
        {/* Price range */}
        {(activeFilters.priceRange.min || activeFilters.priceRange.max) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Price: €{activeFilters.priceRange.min || '0'} - €{activeFilters.priceRange.max || '∞'}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('priceRange')}
            />
          </Badge>
        )}
        
        {/* Categories */}
        {activeFilters.categories.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('categories', filter)}
            />
          </Badge>
        ))}
        
        {/* Brands */}
        {activeFilters.brands.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('brands', filter)}
            />
          </Badge>
        ))}
        
        {/* Power range */}
        {(activeFilters.powerRange.min || activeFilters.powerRange.max) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Power: {activeFilters.powerRange.min || '0'}W - {activeFilters.powerRange.max || '∞'}W
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('powerRange')}
            />
          </Badge>
        )}
        
        {/* Stock range */}
        {(activeFilters.stockRange.min || activeFilters.stockRange.max) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Stock: {activeFilters.stockRange.min || '0'} - {activeFilters.stockRange.max || '∞'} pcs
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('stockRange')}
            />
          </Badge>
        )}
        
        {/* Delivery time */}
        {activeFilters.deliveryTime.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('deliveryTime', filter)}
            />
          </Badge>
        ))}
        
        {/* Payment methods */}
        {activeFilters.paymentMethods.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('paymentMethods', filter)}
            />
          </Badge>
        ))}
        
        {/* Shipping options */}
        {activeFilters.shippingOptions.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter.replace('-', ' ')}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemoveFilter('shippingOptions', filter)}
            />
          </Badge>
        ))}
      </div>
  );
}
