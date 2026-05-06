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
import { joinGroup } from "@/app/actions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const JoinGroupDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!code.trim()) {
      setError("초대 코드를 입력해주세요");
      return;
    }
    startTransition(async () => {
      const result = await joinGroup(code);
      if (result?.error) {
        setError(result.error);
      } else {
        setCode("");
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
          <DialogTitle>그룹 참가</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="초대 코드 8자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? "참가 중..." : "참가하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupDialog;
