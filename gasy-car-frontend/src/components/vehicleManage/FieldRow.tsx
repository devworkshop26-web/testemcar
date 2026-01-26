import React from "react";

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

const FieldRow: React.FC<FieldRowProps> = ({ label, children, hint }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
};

export default FieldRow;
