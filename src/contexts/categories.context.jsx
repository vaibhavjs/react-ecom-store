import { createContext, useState } from "react";

import { getCategoriesAndDocumnets } from "../utils/firebase/firebase.utils.js";

// import SHOP_DATA from "../shop-data.js";
import { useEffect } from "react";

export const CategoriesContext = createContext({
  categoriesMap: {},
});

export const CategoriesProvider = ({ children }) => {
  const [categoriesMap, setCategoriesMap] = useState({});

  // addCollectionAndDoucments("categories", SHOP_DATA);
  useEffect(() => {
    const getCategoriesMap = async () => {
      const categoryMap = await getCategoriesAndDocumnets();
      // console.log(categoryMap);
      setCategoriesMap(categoryMap);
    };
    getCategoriesMap();
  }, []);

  const value = { categoriesMap };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
