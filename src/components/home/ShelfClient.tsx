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
import CreateGroupDialog from "@/components/home/CreateGroupDialog";
import JoinGroupDialog from "@/components/home/JoinGroupDialog";
import { deletePlaylist, leaveGroup } from "@/app/actions";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
  UserAdd01Icon,
  UserGroup02Icon,
} from "@hugeicons/core-free-icons";

type Playlist = {
  id: string;
  title: string;
  cover_image: string | null;
  created_at: string;
  Track: { count: number }[];
};

type Group = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  GroupMember: { count: number }[];
};

type Props = {
  userId: string;
  nickname: string;
  playlists: Playlist[];
  groups: Group[];
};

const ShelfClient = ({ userId, nickname, playlists, groups }: Props) => {
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Playlist | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("shelf");
  const [isPending, startTransition] = useTransition();

  const handleDeletePlaylist = (id: string) => {
    if (!confirm("플레이리스트를 삭제할까요?")) return;
    startTransition(async () => {
      await deletePlaylist(id);
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    if (!confirm("그룹에서 나갈까요?")) return;
    startTransition(async () => {
      await leaveGroup(groupId);
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
        <Tabs defaultValue="shelf" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="shelf">내 서재</TabsTrigger>
            <TabsTrigger value="groups">그룹</TabsTrigger>
          </TabsList>

          <TabsContent value="shelf">
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <p className="text-sm">아직 플레이리스트가 없어요</p>
                <Button size="sm" onClick={() => setCreatePlaylistOpen(true)}>
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
                        <Link href={`/playlist/${playlist.id}`} className="flex-1 min-w-0">
                          <CardTitle className="truncate">{playlist.title}</CardTitle>
                          <CardDescription>
                            {playlist.Track?.[0]?.count ?? 0}곡
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
                            onClick={() => handleDeletePlaylist(playlist.id)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
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
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <p className="text-sm">아직 참가한 그룹이 없어요</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {groups.map((group) => (
                  <Card key={group.id} size="sm" className="hover:ring-foreground/20 transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/group/${group.id}`} className="flex-1 min-w-0">
                          <CardTitle className="truncate">{group.name}</CardTitle>
                          <CardDescription>
                            멤버 {group.GroupMember?.[0]?.count ?? 0}명 · 코드: {group.invite_code}
                          </CardDescription>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={isPending}
                          title={group.created_by === userId ? "그룹 삭제" : "그룹 나가기"}
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-6 right-6 flex flex-col gap-2 items-end">
        {activeTab === "groups" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full shadow-md gap-2"
              onClick={() => setJoinGroupOpen(true)}
            >
              <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
              참가
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full shadow-md gap-2"
              onClick={() => setCreateGroupOpen(true)}
            >
              <HugeiconsIcon icon={UserGroup02Icon} strokeWidth={2} />
              만들기
            </Button>
          </>
        )}
        {activeTab === "shelf" && (
          <Button
            size="icon-lg"
            className="rounded-full shadow-lg"
            onClick={() => setCreatePlaylistOpen(true)}
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          </Button>
        )}
      </div>

      <CreatePlaylistDialog open={createPlaylistOpen} onOpenChange={setCreatePlaylistOpen} />
      <EditPlaylistDialog
        playlist={editTarget}
        open={!!editTarget}
        onOpenChange={(open: boolean) => { if (!open) setEditTarget(null); }}
      />
      <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen} />
      <JoinGroupDialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen} />
    </div>
  );
};

export default ShelfClient;
