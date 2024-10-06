import React from 'react';

interface StyledAIResponseProps {
  text: string;
}

const StyledAIResponse: React.FC<StyledAIResponseProps> = ({ text }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default StyledAIResponse;