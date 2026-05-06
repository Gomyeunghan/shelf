"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGroup } from "@/app/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateGroupDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("그룹 이름을 입력해주세요");
      return;
    }
    startTransition(async () => {
      const result = await createGroup({ name });
      if (result?.error) {
        setError(result.error);
      } else {
        setName("");
        setError("");
        onOpenChange(false);
        if (result.groupId) router.push(`/group/${result.groupId}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 그룹 만들기</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="그룹 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? "만드는 중..." : "만들기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
