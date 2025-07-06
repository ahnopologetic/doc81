"use client";

import { useState } from "react";
import { useTemplates } from "@/hooks";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FileText, Heart } from "lucide-react";
import { TemplateListItem } from "@/lib/api/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AvatarCircles } from "@/components/magicui/avatar-circles";

export default function TemplatesPage() {
  const router = useRouter();
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());

  // Fetch templates data
  const { data: templates, isLoading, error } = useTemplates();

  // Split templates into user's templates and public templates
  const userTemplates = templates?.filter(template => template.tags.includes("user")) || [];
  const publicTemplates = templates?.filter(template => !template.tags.includes("user")) || [];

  const toggleLike = (templateId: string) => {
    setLikedTemplates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  };

  const renderTemplateCard = (template: TemplateListItem) => {
    const isLiked = likedTemplates.has(template.id);
    const companyTags = template.tags.filter(tag => tag.startsWith("company:"));
    const restTags = template.tags.filter(tag => !tag.startsWith("company:"));

    return (
      <Card
        key={template.id}
        className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                {restTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs mr-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLike(template.id)}
              className={`p-2 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#d97757] transition-colors">
                {template.name}
              </h3>
              <Markdown remarkPlugins={[remarkGfm]}>{template.description || "No description available"}</Markdown>
            </div>
            <div className="flex items-center space-x-2">
              <AvatarCircles avatarUrls={companyTags.map((tag) => ({
                imageUrl: `https://img.logo.dev/${tag.replace("company:", "").toLowerCase()}.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=50&retina=true`,
                profileUrl: `https://${tag.replace("company:", "").toLowerCase()}.com`,
              }))} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 100)}</span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                onClick={() => router.push(`/templates/${template.id}`)}
              >
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">Loading templates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center text-red-500">Error loading templates</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Library</h1>
            <p className="text-xl text-gray-600">
              Browse and use our collection of professional templates
            </p>
          </div>

          {/* My Templates Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Templates</h2>
              <Button
                className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                onClick={() => router.push("/templates/create")}
              >
                Create Template
              </Button>
            </div>

            {userTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTemplates.map(template => renderTemplateCard(template))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No personal templates yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first template to see it here
                </p>
                <Button
                  className="bg-[#d97757] hover:bg-[#c86a4a] text-white"
                  onClick={() => router.push("/templates/create")}
                >
                  Create Template
                </Button>
              </div>
            )}
          </div>

          {/* Public Templates Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Explore Public Templates</h2>

            {publicTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicTemplates.map(template => renderTemplateCard(template))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No public templates available</h3>
                <p className="text-gray-600 mb-4">
                  Check back later for community templates
                </p>
                <Button
                  variant="outline"
                  className="border-[#d97757] text-[#d97757] hover:bg-[#d97757] hover:text-white"
                  onClick={() => router.push("/explore")}
                >
                  Explore Templates
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 