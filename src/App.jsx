import React, { useEffect } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchItems } from "./api/items";

const App = () => {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>{error.message}</div>
  ) : (
    <div className="flex flex-col gap-2">
      {data.pages.map((page) => {
        return (
          <div key={page.currentPage}>
            {page.data.map((item) => {
              return (
                <div key={item.id} className="p-4 bg-pink-200">
                  {item.name}
                </div>
              );
            })}
          </div>
        );
      })}

      <div ref={ref}>{isFetchingNextPage && "Loading........"}</div>
    </div>
  );
};

export default App;
