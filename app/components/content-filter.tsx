import React from "react";
import { useSearchParams } from "react-router";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Category } from "~/services.server/sanity/articles";

export function ContentFilter({ categories }: { categories: Category[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = React.useState({
    category: "",
    order: "createdAt desc",
  });

  const CATEGORY = "category";

  function handleCategorySelect(category: string) {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        params.delete(CATEGORY);
        if (category) {
          params.set(CATEGORY, encodeURIComponent(category));
        } else {
          params.delete(CATEGORY);
        }
        return params;
      },
      { preventScrollReset: true },
    );
  }

  type OrderValue = "createdAt asc" | "createdAt desc";
  const ORDER = "order" as OrderValue;

  function handleOrderSelect(order: OrderValue) {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        params.set(ORDER, order);
        return params;
      },
      { preventScrollReset: true },
    );
  }

  function handleSelectOnchange(
    value: string | OrderValue,
    type: "category" | "order",
  ) {
    setFilters((prevF) => ({ ...prevF, [type]: value }));
    return type === "category"
      ? handleCategorySelect(value)
      : handleOrderSelect(value as OrderValue);
  }

  React.useEffect(() => {
    const category = searchParams.get(CATEGORY) || "";
    const order = (searchParams.get(ORDER) || "createdAt desc") as OrderValue;
    setFilters({ category, order });
  }, [searchParams]);

  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-500" />
        <span className="font-medium">Filters:</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          value={filters.category}
          onValueChange={(value) => handleSelectOnchange(value, "category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.order || "createdAt desc"}
          onValueChange={(value) => handleSelectOnchange(value, "order")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt desc">Newest</SelectItem>
            <SelectItem value="createdAt asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
