"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTemplates } from "@/hooks";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function TemplateCarousel() {
    const { data: templates, isLoading } = useTemplates();
    const [viewportRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        skipSnaps: false,
        dragFree: true,
    });

    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);

    // Auto-scroll the carousel when not hovering
    useEffect(() => {
        if (!emblaApi || !autoplayEnabled) return;

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 3000);

        return () => clearInterval(autoplay);
    }, [emblaApi, autoplayEnabled]);

    const truncateContent = useCallback((content: string, isHovered: boolean): string => {
        const maxLength = isHovered ? 300 : 100;
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    }, []);

    // Pause autoplay when hovering over any template
    const handleMouseEnter = useCallback((templateId: string) => {
        setHoveredTemplate(templateId);
        setAutoplayEnabled(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredTemplate(null);
        setAutoplayEnabled(true);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d97757]"></div>
            </div>
        );
    }

    if (!templates || templates.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={viewportRef}>
                <div className="flex">
                    {templates.map((template) => {
                        const isHovered = hoveredTemplate === template.id;

                        return (
                            <div
                                key={template.id}
                                className="flex-[0_0_300px] min-w-0 mx-4"
                                onMouseEnter={() => handleMouseEnter(template.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Card className={`h-[250px] overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-105 z-10' : ''}`}>
                                    <CardContent className="p-4 h-full flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-[#d97757]" />
                                            <h3 className="font-medium text-lg line-clamp-1">{template.name}</h3>
                                        </div>

                                        <div className={`bg-gray-50 rounded p-3 flex-grow overflow-hidden text-sm transition-all duration-300 ${isHovered ? 'max-h-[180px] overflow-y-auto' : 'max-h-[120px]'}`}>
                                            <div className="prose prose-sm max-w-none">
                                                {/* In a real implementation, we would fetch the actual template content */}
                                                <p>{truncateContent(template.description || "No description available.", isHovered)}</p>

                                                {isHovered && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500">Path: {template.path}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex justify-end">
                                            <Link href={`/templates/${template.path}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`transition-all duration-300 ${isHovered ? 'bg-[#d97757] text-white hover:bg-[#c86a4a]' : 'text-[#d97757]'}`}
                                                >
                                                    {isHovered ? 'Use this template' : 'View details'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link href="/templates">
                    <Button className="bg-[#d97757] hover:bg-[#c86a4a] text-white">
                        Explore More Templates
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
} 