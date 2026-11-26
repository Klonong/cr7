"use client";

import * as React from "react";
import { fetchPublicCategories } from "@/lib/api/category-api";
import type { Category } from "@/interface/catalog";

export function useFooterCategories() {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchPublicCategories()
      .then((list) => {
        if (active) {
          setCategories(list);
        }
      })
      .catch(() => {
        // Retain current categories on transient network error
      });
    return () => {
      active = false;
    };
  }, []);

  return categories;
}
