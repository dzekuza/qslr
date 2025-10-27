import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./ProductCatalog.module.css";

interface ProductCatalogHeaderProps {
  title: string;
  resultCount: number;
  currentPage: number;
  totalPages: number;
}

export function ProductCatalogHeader({ 
  title, 
  resultCount, 
  currentPage, 
  totalPages 
}: ProductCatalogHeaderProps) {
  return (
    <div className={styles.catalogHeader}>
      {/* Title and Results */}
      <div className={styles.headerLeft}>
        <h1 className={styles.catalogTitle}>{title}</h1>
        <p className={styles.resultCount}>{resultCount} results</p>
      </div>

      {/* Controls */}
      <div className={styles.headerControls}>
        {/* Group Offers Toggle */}
        <div className={styles.groupOffersToggle}>
          <span className={styles.toggleLabel}>Group offers</span>
          <div className={`${styles.toggleSwitch} ${false ? styles.active : ""}`}>
            <div className={`${styles.toggleThumb} ${false ? styles.active : ""}`}></div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <Button variant="outline" className="flex items-center gap-2">
            Sort
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button className={styles.paginationButton}>
            ←
          </button>
          <span className={styles.paginationInfo}>
            {currentPage} of {totalPages}
          </span>
          <button className={styles.paginationButton}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
