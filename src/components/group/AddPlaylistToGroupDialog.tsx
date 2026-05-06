"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addPlaylistToGroup } from "@/app/actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, TickDouble01Icon } from "@hugeicons/core-free-icons";

type Props = {
  groupId: string;
  myPlaylists: { id: string; title: string }[];
  alreadyAdded: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddPlaylistToGroupDialog = ({ groupId, myPlaylists, alreadyAdded, open, onOpenChange }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleAdd = (playlistId: string) => {
    startTransition(async () => {
      await addPlaylistToGroup(playlistId, groupId);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 추가</DialogTitle>
        </DialogHeader>
        {myPlaylists.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            내 플레이리스트가 없어요
          </p>
        ) : (
          <div className="space-y-1">
            {myPlaylists.map((playlist) => {
              const added = alreadyAdded.includes(playlist.id);
              return (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-muted"
                >
                  <span className="text-sm truncate">{playlist.title}</span>
                  <Button
                    size="icon-sm"
                    variant={added ? "secondary" : "outline"}
                    disabled={isPending || added}
                    onClick={() => handleAdd(playlist.id)}
                  >
                    <HugeiconsIcon
                      icon={added ? TickDouble01Icon : Add01Icon}
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPlaylistToGroupDialog;
