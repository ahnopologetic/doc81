import Markdown from "react-markdown";
import { Timeline } from "./ui/timeline";
import { truncateContent } from "@/lib/utils";
import remarkGfm from "remark-gfm";

interface MarkdownTimelineProps {
    markdown: string;
    title?: string;
    description?: string;
}

const MarkdownTimeline = ({ markdown, title, description }: MarkdownTimelineProps) => {
    // parse the markdown headers and create a timeline with its children
    const headers = markdown.match(/^#+\s+(.*)$/gm);
    const timeline = headers?.map((header) => {
        const title = header.replace(/^#+\s+/, "");
        const children = markdown.split(header).slice(1);
        const truncatedChildren = children.map((child, idx) => {
            return <Markdown remarkPlugins={[remarkGfm]} key={idx}>{truncateContent(child, false)}</Markdown>;
        });
        const renderedChildren = truncatedChildren.slice(0, 1);
        return {
            title: title,
            content: renderedChildren,
        };
    }) || [];

    return (
        <Timeline data={timeline} title={title} description={description} />
    );
};

export default MarkdownTimeline;