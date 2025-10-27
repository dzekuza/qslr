"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import { FilterState } from "@/hooks/useProductFilters";

interface MobileFiltersProps {
  activeFilterCount: number;
  filters: FilterState;
  onCheckboxChange: (category: keyof FilterState, value: string, checked: boolean) => void;
  onRangeChange: (category: keyof FilterState, field: 'min' | 'max', value: string) => void;
  onClearAll: () => void;
}

export function MobileFilters({ 
  activeFilterCount, 
  filters, 
  onCheckboxChange, 
  onRangeChange, 
  onClearAll 
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProductFilters 
            filters={filters}
            onCheckboxChange={onCheckboxChange}
            onRangeChange={onRangeChange}
            onClearAll={onClearAll}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}