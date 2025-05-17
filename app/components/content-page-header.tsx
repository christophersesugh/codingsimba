import React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchParams } from "react-router";
import { useDebounce } from "~/utils/misc";

type HeaderProps = {
  title: string;
  description: string;
  placeholder: string;
};

export function Header({ title, description, placeholder }: HeaderProps) {
  const SEARCH = "search";
  const DB_DELAY = 300;

  const [search, setSearch] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = useDebounce((value: string) => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      params.delete(SEARCH);
      if (value) {
        params.set(SEARCH, value);
      } else {
        params.delete(SEARCH);
      }
      return params;
    });
  }, DB_DELAY);

  React.useEffect(() => {
    setSearch(searchParams.get(SEARCH) ?? "");
  }, [searchParams, setSearch]);

  return (
    <div className="border-b border-gray-200 bg-blue-50 pb-12 pt-20 dark:border-gray-800 dark:bg-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold capitalize md:text-5xl">
            {title}
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <div className="relative mx-auto max-w-2xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={20}
            />
            <Input
              type="search"
              value={search}
              placeholder={placeholder}
              onChange={(e) => {
                const value = e.target.value.trim().toLowerCase();
                setSearch(value);
                handleSearchChange(value);
              }}
              className="rounded-full border-gray-300 bg-white py-6 pl-10 text-base dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
