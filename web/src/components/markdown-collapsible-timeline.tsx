"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import remarkGfm from "remark-gfm";

interface MarkdownCollapsibleTimelineProps {
    markdown: string;
    title?: string;
    description?: string;
    className?: string;
    itemClassName?: string;
    headerClassName?: string;
    contentClassName?: string;
}

const MarkdownCollapsibleTimeline = ({
    markdown,
    title,
    description,
    className,
    itemClassName,
    headerClassName,
    contentClassName,
}: MarkdownCollapsibleTimelineProps) => {
    // Parse the markdown headers and create a timeline with its children
    const headers = markdown.match(/^#+\s+(.*)$/gm);

    // Create an array of expanded states for each header
    const [expandedItems, setExpandedItems] = useState<boolean[]>(
        headers ? headers.map(() => false) : []
    );

    // Toggle expanded state for an item
    const toggleItem = (index: number) => {
        setExpandedItems((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // Parse markdown content into sections with headers and content
    const sections = headers?.map((header, index) => {
        const title = header.replace(/^#+\s+/, "");
        const headerLevel = header.match(/^(#+)/)?.[0].length || 1;

        // Get content after this header but before the next header
        const headerIndex = markdown.indexOf(header);
        const nextHeaderIndex = headers[index + 1]
            ? markdown.indexOf(headers[index + 1], headerIndex)
            : markdown.length;

        const content = markdown.substring(
            headerIndex + header.length,
            nextHeaderIndex
        ).trim();

        return {
            title,
            headerLevel,
            content,
            index,
        };
    }) || [];

    return (
        <div className={cn("w-full", className)}>
            {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

            <ol className="list-decimal list-outside pl-6 space-y-2">
                {sections.map((section) => (
                    <li
                        key={section.index}
                        className={cn(
                            "transition-all duration-200",
                            itemClassName
                        )}
                    >
                        <Collapsible
                            open={expandedItems[section.index]}
                            onOpenChange={() => toggleItem(section.index)}
                            className="w-full"
                        >
                            <CollapsibleTrigger
                                className={cn(
                                    "flex items-center w-full cursor-pointer py-2 hover:text-gray-700 justify-between",
                                    headerClassName
                                )}
                            >
                                <span className="font-medium text-left">{section.title}</span>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <ChevronsUpDown />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div
                                    className={cn(
                                        "pl-6 py-2 prose prose-sm max-w-none",
                                        contentClassName
                                    )}
                                >
                                    <Markdown remarkPlugins={[remarkGfm]}>{section.content}</Markdown>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default MarkdownCollapsibleTimeline;
