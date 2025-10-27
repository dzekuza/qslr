"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProductFilters() {
  return (
    <div className="bg-neutral-50 rounded-[10px] p-4 flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-black">Filters</h2>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="availability" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-2 hover:no-underline">
            <p className="text-base font-medium text-black">Availability</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">In stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Out of stock</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-2 hover:no-underline">
            <p className="text-base font-medium text-black">Price</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">€0 - €100</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">€100 - €500</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">€500+</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-2 hover:no-underline">
            <p className="text-base font-medium text-black">Category</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Solar Panels</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Inverters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Mounting Systems</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-2 hover:no-underline">
            <p className="text-base font-medium text-black">Brand</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">JA Solar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Trina Solar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">LG Solar</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
