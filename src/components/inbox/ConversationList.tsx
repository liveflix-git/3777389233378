import React from 'react';
import { ConversationItem, ConversationData } from './ConversationItem';

interface ConversationListProps {
  conversations: ConversationData[];
  onConversationClick: (conv: ConversationData) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onConversationClick,
}) => {
  return (
    <div className="w-full flex flex-col select-none">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          onClick={() => onConversationClick(conv)}
        />
      ))}
    </div>
  );
};
