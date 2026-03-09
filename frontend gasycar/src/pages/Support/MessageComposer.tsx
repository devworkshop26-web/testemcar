import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

export function MessageComposer({
  value,
  setValue,
  onSend,
}: {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-center gap-2 pt-3">
      <Textarea
        placeholder="Écrire un message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 resize-none"
      />

      <Button
        onClick={onSend}
        className="flex items-center gap-1"
        disabled={!value.trim()}
      >
        <SendHorizontal className="w-4 h-4" />
        Envoyer
      </Button>
    </div>
  );
}
