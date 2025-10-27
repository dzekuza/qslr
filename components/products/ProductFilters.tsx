"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterState, useProductFilters } from "@/hooks/useProductFilters";

interface ProductFiltersProps {
  filters: FilterState;
  onCheckboxChange: (
    category: keyof FilterState,
    value: string,
    checked: boolean,
  ) => void;
  onRangeChange: (
    category: keyof FilterState,
    field: "min" | "max",
    value: string,
  ) => void;
  onClearAll: () => void;
}

export function ProductFilters({
  filters,
  onCheckboxChange,
  onRangeChange,
  onClearAll,
}: ProductFiltersProps) {
  // Safety check for filters
  if (!filters) {
    return null;
  }

  return (
    <div className="bg-neutral-50 rounded-[10px] p-4 flex flex-col gap-2">
      <Accordion type="multiple" className="w-full">
        {/* Availability Filters */}
        <AccordionItem value="availability" className="border-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Availability</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.availability.includes("in-stock")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "availability",
                      "in-stock",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Available now</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.availability.includes("low-stock")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "availability",
                      "low-stock",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Low stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.availability.includes("out-of-stock")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "availability",
                      "out-of-stock",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Out of stock</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Price (EUR)</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="price-min" className="text-xs text-gray-600">
                    Min
                  </Label>
                  <Input
                    id="price-min"
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      onRangeChange("priceRange", "min", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="price-max" className="text-xs text-gray-600">
                    Max
                  </Label>
                  <Input
                    id="price-max"
                    type="number"
                    placeholder="1000"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      onRangeChange("priceRange", "max", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
                    checked={filters.priceRange.min === "0" &&
                      filters.priceRange.max === "100"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onRangeChange("priceRange", "min", "0");
                        onRangeChange("priceRange", "max", "100");
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">€0 - €100</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
                    checked={filters.priceRange.min === "100" &&
                      filters.priceRange.max === "500"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onRangeChange("priceRange", "min", "100");
                        onRangeChange("priceRange", "max", "500");
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">€100 - €500</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
                    checked={filters.priceRange.min === "500" &&
                      filters.priceRange.max === ""}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onRangeChange("priceRange", "min", "500");
                        onRangeChange("priceRange", "max", "");
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">€500+</span>
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="category" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Categories</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("solar-panels")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "solar-panels",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Solar Panels</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("inverters")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "inverters",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Inverters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("battery-storage")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "battery-storage",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">
                  Solar Battery Storage
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("mounting-systems")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "mounting-systems",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Mounting Systems</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("electro-technical")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "electro-technical",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Electro-technical</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes("e-mobility")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "categories",
                      "e-mobility",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">E-mobility</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brand" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Brand</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                "JA Solar",
                "LONGI",
                "Trina Solar",
                "Canadian Solar",
                "Jinko Solar",
                "Huawei",
                "SolarEdge",
                "Sungrow",
                "BYD",
                "FoxESS",
                "Growatt",
                "Fronius",
                "SOFAR",
                "Solax",
                "SMA",
                "Goodwe",
                "Wallbox",
                "Deye",
                "KSTAR",
                "Solis",
              ].map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
                    checked={filters.brands.includes(
                      brand.toLowerCase().replace(/\s+/g, "-"),
                    )}
                    onChange={(e) =>
                      onCheckboxChange(
                        "brands",
                        brand.toLowerCase().replace(/\s+/g, "-"),
                        e.target.checked,
                      )}
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Power Range */}
        <AccordionItem value="power" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Power (W)</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="power-min" className="text-xs text-gray-600">
                    Min
                  </Label>
                  <Input
                    id="power-min"
                    type="number"
                    placeholder="0"
                    value={filters.powerRange.min}
                    onChange={(e) =>
                      onRangeChange("powerRange", "min", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="power-max" className="text-xs text-gray-600">
                    Max
                  </Label>
                  <Input
                    id="power-max"
                    type="number"
                    placeholder="1000"
                    value={filters.powerRange.max}
                    onChange={(e) =>
                      onRangeChange("powerRange", "max", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Panel Type */}
        <AccordionItem value="panel-type" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Panel Type</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.panelTypes.includes("monofacial")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "panelTypes",
                      "monofacial",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Monofacial</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.panelTypes.includes("bifacial")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "panelTypes",
                      "bifacial",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Bifacial</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.panelTypes.includes("p-type")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "panelTypes",
                      "p-type",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">P-Type</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.panelTypes.includes("n-type")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "panelTypes",
                      "n-type",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">N-Type</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stock Range */}
        <AccordionItem value="stock" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">
              Availability (pcs)
            </p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="stock-min" className="text-xs text-gray-600">
                    Min
                  </Label>
                  <Input
                    id="stock-min"
                    type="number"
                    placeholder="0"
                    value={filters.stockRange.min}
                    onChange={(e) =>
                      onRangeChange("stockRange", "min", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="stock-max" className="text-xs text-gray-600">
                    Max
                  </Label>
                  <Input
                    id="stock-max"
                    type="number"
                    placeholder="10000"
                    value={filters.stockRange.max}
                    onChange={(e) =>
                      onRangeChange("stockRange", "max", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Delivery Time */}
        <AccordionItem value="delivery" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Delivery Time</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.deliveryTime.includes("1-week")}
                  onCheckedChange={(checked) => onCheckboxChange(
                    "deliveryTime",
                    "1-week",
                    checked as boolean,
                  )}
                />
                <span className="text-sm text-gray-700">Up to 1 week</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.deliveryTime.includes("1-2-weeks")}
                  onCheckedChange={(checked) => onCheckboxChange(
                    "deliveryTime",
                    "1-2-weeks",
                    checked as boolean,
                  )}
                />
                <span className="text-sm text-gray-700">1-2 weeks</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.deliveryTime.includes("2-weeks-1-month")}
                  onCheckedChange={(checked) => onCheckboxChange(
                    "deliveryTime",
                    "2-weeks-1-month",
                    checked as boolean,
                  )}
                />
                <span className="text-sm text-gray-700">2 weeks - 1 month</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.deliveryTime.includes("more-than-1-month")}
                  onCheckedChange={(checked) => onCheckboxChange(
                    "deliveryTime",
                    "more-than-1-month",
                    checked as boolean,
                  )}
                />
                <span className="text-sm text-gray-700">More than 1 month</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payment Methods */}
        <AccordionItem value="payment" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Payment Methods</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.paymentMethods.includes("paypal")}
                  onCheckedChange={(checked) => onCheckboxChange(
                    "paymentMethods",
                    "paypal",
                    checked as boolean,
                  )}
                />
                <span className="text-sm text-gray-700">Pay with PayPal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.paymentMethods.includes("wire-transfer")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "paymentMethods",
                      "wire-transfer",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">
                  Secure wire transfer
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.paymentMethods.includes("buy-now-pay-later")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "paymentMethods",
                      "buy-now-pay-later",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Buy Now Pay Later</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Shipping Options */}
        <AccordionItem value="shipping" className="border-0">
          <div className="h-px bg-gray-200 w-full"></div>
          <AccordionTrigger className="py-4 hover:no-underline">
            <p className="text-base font-medium text-black">Shipping Options</p>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.shippingOptions.includes(
                    "delivery-by-store",
                  )}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "shippingOptions",
                      "delivery-by-store",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Delivery by QSLR</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.shippingOptions.includes("pickup")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "shippingOptions",
                      "pickup",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Pickup</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.shippingOptions.includes("super-seller")}
                  onCheckedChange={(checked) =>
                    onCheckboxChange(
                      "shippingOptions",
                      "super-seller",
                      checked as boolean,
                    )}
                />
                <span className="text-sm text-gray-700">Super Seller</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear All Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-xs mt-4"
      >
        Clear All
      </Button>
    </div>
  );
}
