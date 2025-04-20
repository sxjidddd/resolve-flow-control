
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GeminiKeyInputProps {
  geminiKey: string;
  setGeminiKey: (val: string) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const GeminiKeyInput: React.FC<GeminiKeyInputProps> = ({
  geminiKey,
  setGeminiKey,
  onSave,
  onCancel,
}) => (
  <div className="p-3 bg-secondary flex items-center gap-2">
    <form onSubmit={onSave} className="flex gap-2 items-center w-full">
      <Input
        type="password"
        className="w-full"
        placeholder="Enter your Gemini API key"
        value={geminiKey}
        onChange={(e) => setGeminiKey(e.target.value)}
      />
      <Button size="sm" type="submit" variant="default">
        Save
      </Button>
      <Button size="sm" type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  </div>
);

export default GeminiKeyInput;
