"use client";

import { useState } from "react";
import { useCreateUser, useUpdateUser } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface UserFormProps {
  userId?: string;
  defaultValues?: {
    username?: string;
    email?: string;
    full_name?: string;
  };
  onSuccess?: () => void;
}

export function UserForm({ userId, defaultValues, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: defaultValues?.username || "",
    email: defaultValues?.email || "",
    password: "",
    full_name: defaultValues?.full_name || "",
  });

  // Use the create or update mutation based on whether we have a userId
  const createUser = useCreateUser();
  const updateUser = useUpdateUser(userId || "");

  const isUpdating = !!userId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isUpdating) {
        // For update, we don't need to send the username
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { username, ...updateData } = formData;
        // Only include password if it's not empty
        const finalUpdateData = {
          ...updateData,
          ...(updateData.password ? {} : { password: undefined })
        };

        await updateUser.mutateAsync(finalUpdateData);
        toast.success("User updated successfully");
      } else {
        await createUser.mutateAsync(formData);
        toast.success("User created successfully");

        // Reset form after creation
        setFormData({
          username: "",
          email: "",
          password: "",
          full_name: "",
        });
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isUpdating && (
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required={!isUpdating}
                disabled={isUpdating}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password {isUpdating && "(leave blank to keep current)"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!isUpdating}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : isUpdating ? "Update User" : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 