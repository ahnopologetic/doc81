"use client";

import { useState } from "react";
import { useInfiniteQueryData } from "@/hooks";
import { User } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userKeys } from "@/hooks/use-users";

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use the infinite query hook
  const {
    data: users,
    isLoading,
    isError,
    hasMoreData,
    loadMore,
    isFetchingNextPage,
    totalCount,
  } = useInfiniteQueryData<User>({
    endpoint: "/users",
    queryKey: [...userKeys.lists(), { search: searchTerm }],
    pageSize: 10,
    filters: searchTerm ? { search: searchTerm } : {},
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch when the filters change
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error loading users</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users ({totalCount})</h2>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-2 border rounded-md"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <h3 className="font-medium">{user.full_name || user.username}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-2">
                User since: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {hasMoreData && (
        <div className="text-center mt-4">
          <Button 
            onClick={() => loadMore()} 
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
      
      {!hasMoreData && users.length > 0 && (
        <p className="text-center text-gray-500 mt-4">
          All users loaded
        </p>
      )}
      
      {users.length === 0 && (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
} 