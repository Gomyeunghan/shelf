"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import CreatePlaylistDialog from "@/components/home/CreatePlaylistDialog";
import EditPlaylistDialog from "@/components/home/EditPlaylistDialog";
import { deletePlaylist } from "@/app/actions";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

type Playlist = {
  id: string;
  title: string;
  cover_image: string | null;
  created_at: string;
  Track?: { id: string }[];
};

type Props = {
  nickname: string;
  playlists: Playlist[];
};

const ShelfClient = ({ nickname, playlists }: Props) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Playlist | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("플레이리스트를 삭제할까요?")) return;
    startTransition(async () => {
      await deletePlaylist(id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 pb-0">
        <h1 className="text-2xl font-bold">Shelf</h1>
        <p className="text-muted-foreground text-sm mt-1">
          안녕하세요, {nickname} 님
        </p>
      </header>

      <main className="flex-1 p-6">
        <Tabs defaultValue="shelf">
          <TabsList className="mb-4">
            <TabsTrigger value="shelf">내 서재</TabsTrigger>
            <TabsTrigger value="groups">그룹</TabsTrigger>
          </TabsList>

          <TabsContent value="shelf">
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <p className="text-sm">아직 플레이리스트가 없어요</p>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  첫 플레이리스트 만들기
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {playlists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    size="sm"
                    className="hover:ring-foreground/20 transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/playlist/${playlist.id}`}
                          className="flex-1 min-w-0"
                        >
                          <CardTitle className="truncate">
                            {playlist.title}
                          </CardTitle>
                          <CardDescription>
                            {playlist.Track?.length ?? 0}곡
                          </CardDescription>
                        </Link>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setEditTarget(playlist)}
                          >
                            <HugeiconsIcon icon={Edit01Icon} strokeWidth={2} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={isPending}
                            onClick={() => handleDelete(playlist.id)}
                          >
                            <HugeiconsIcon
                              icon={Delete01Icon}
                              strokeWidth={2}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="groups">
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <p className="text-sm">그룹 기능은 곧 추가될 예정이에요</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-6 right-6">
        <Button
          size="icon-lg"
          className="rounded-full shadow-lg"
          onClick={() => setCreateOpen(true)}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
        </Button>
      </div>

      <CreatePlaylistDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditPlaylistDialog
        playlist={editTarget}
        open={!!editTarget}
        onOpenChange={(open: boolean) => {
          if (!open) setEditTarget(null);
        }}
      />
    </div>
  );
};

export default ShelfClient;
