"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTemplates } from "@/hooks";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        slidesToScroll: 1,
        containScroll: "trimSnaps",
    });

    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Update scroll buttons state
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };

        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        onSelect();

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi]);

    // Auto-scroll the carousel when not hovering
    useEffect(() => {
        if (!emblaApi || !autoplayEnabled) return;

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 3000);

        return () => clearInterval(autoplay);
    }, [emblaApi, autoplayEnabled]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

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
            {/* Navigation Arrows */}
            <Button 
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#d97757] rounded-full shadow-md p-2 -ml-4"
                size="icon"
                variant="ghost"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#d97757] rounded-full shadow-md p-2 -mr-4"
                size="icon"
                variant="ghost"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="h-full overflow-hidden" ref={viewportRef}>
                <div className="flex">
                    {templates.map((template) => {
                        const isHovered = hoveredTemplate === template.id;

                        return (
                            <div
                                key={template.id}
                                className="flex-[0_0_33.333%] min-w-0 mx-4 md:flex-[0_0_30%] sm:flex-[0_0_80%]"
                                onMouseEnter={() => handleMouseEnter(template.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Card className={`transition-all duration-300 ${isHovered ? 'shadow-lg scale-105 z-10' : ''}`}>
                                    <CardContent className="h-[400px] grid grid-cols-1 grid-rows-[auto_1fr_auto_auto] gap-4 p-4">
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-lg">{template.name}</h3>
                                        </div>

                                        <div className="relative overflow-hidden">
                                            <div className="h-full">
                                                <p className="text-sm text-gray-600 mb-2">{template.description}</p>

                                                <div
                                                    className={`bg-gray-50 rounded p-4 markdown-content h-full overflow-y-auto transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                                                        }`}
                                                >
                                                    <Markdown>
                                                        {truncateContent(template.content, isHovered)}
                                                    </Markdown>
                                                </div>
                                            </div>
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

                                        <div className="flex justify-end w-full">
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

            {/* Carousel Controls - Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {templates.length > 0 && Array.from({ length: Math.min(5, templates.length) }).map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                            emblaApi?.selectedScrollSnap() === index 
                                ? 'bg-[#d97757] w-4' 
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
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