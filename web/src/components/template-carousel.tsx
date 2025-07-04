"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTemplates } from "@/hooks";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// FAANG + NVIDIA, MICROSOFT
const COMPANY_LOGOS = {
    "meta": "/logos/meta.svg",
    "apple": "/logos/apple.svg",
    "amazon": "/logos/amazon.svg",
    "google": "/logos/google.svg",
    "microsoft": "/logos/microsoft.svg",
    "nvidia": "/logos/nvidia.svg",
}

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
                                className="flex-1 min-w-0 mx-4"
                                onMouseEnter={() => handleMouseEnter(template.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Card className={`transition-all duration-300 ${isHovered ? 'shadow-lg scale-105 z-10' : ''}`}>
                                    <CardContent className="h-full flex flex-col items-start max-w-full gap-2">
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-md">{template.name}</h3>
                                        </div>

                                        <div className="flex w-full">
                                            <div className="flex-grow">
                                                <p className="text-xs text-gray-500">{template.description}</p>
                                            </div>

                                            {isHovered && (
                                                <div className="bg-gray-50 rounded p-3 ml-2 w-[1000px] max-h-[300px] overflow-y-auto text-sm">
                                                    <Markdown>
                                                        {truncateContent(template.content, true)}
                                                    </Markdown>
                                                </div>
                                            )}
                                        </div>

                                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                                            {template.tags.map((tag) => (
                                                COMPANY_LOGOS[tag.replace("company:", "").toLowerCase() as keyof typeof COMPANY_LOGOS] && (
                                                    <Avatar key={tag} className="w-8 h-8 border-2 border-gray-200">
                                                        <AvatarImage src={COMPANY_LOGOS[tag.replace("company:", "").toLowerCase() as keyof typeof COMPANY_LOGOS]} alt={tag} />
                                                        <AvatarFallback>{tag}</AvatarFallback>
                                                    </Avatar>
                                                )
                                            ))}
                                        </div>

                                        <div className="mt-2 flex justify-end w-full">
                                            <Link href={`/templates/${template.id}`}>
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