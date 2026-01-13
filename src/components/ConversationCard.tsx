import { Bot } from "lucide-react";

interface ConversationCardProps {
  text: string;
}

const ConversationCard = ({ text }: ConversationCardProps) => {
  // Simple markdown-like parsing for basic formatting
  const formatText = (content: string) => {
    // Split by newlines to handle paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Handle bullet points
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={pIndex} className="list-disc list-inside space-y-1 mb-3">
            {items.map((item, iIndex) => (
              <li key={iIndex} className="text-foreground/90">
                {formatInlineText(item.replace(/^-\s*/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ol key={pIndex} className="list-decimal list-inside space-y-1 mb-3">
            {items.map((item, iIndex) => (
              <li key={iIndex} className="text-foreground/90">
                {formatInlineText(item.replace(/^\d+\.\s*/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraph
      return (
        <p key={pIndex} className="text-foreground/90 mb-3 last:mb-0">
          {formatInlineText(paragraph)}
        </p>
      );
    });
  };
  
  // Handle inline formatting (bold, italic)
  const formatInlineText = (text: string) => {
    // Replace **text** with bold
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 rounded-xl bg-secondary/20 neon-glow-purple">
          <Bot className="w-6 h-6 text-secondary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-secondary">Assistente Financeiro</span>
            <span className="text-xs text-muted-foreground">• Agora</span>
          </div>
          
          <div className="prose prose-sm prose-invert max-w-none">
            {formatText(text)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
