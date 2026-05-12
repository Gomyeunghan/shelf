"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { leaveGroup, removePlaylistFromGroup } from "@/app/actions";
import AddPlaylistToGroupDialog from "@/components/group/AddPlaylistToGroupDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Delete01Icon,
  Add01Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

type Group = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
};

type GroupPlaylist = {
  Playlist: {
    id: string;
    title: string;
    cover_image: string | null;
    user_id: string;
    Track: { count: number }[];
    User: { nickname: string };
  };
};

type GroupMemberItem = {
  user_id: string;
  joined_at: string;
  User: { nickname: string; avatar: string | null };
};

type Props = {
  group: Group;
  userId: string;
  members: GroupMemberItem[];
  groupPlaylists: GroupPlaylist[];
  myPlaylists: { id: string; title: string }[];
};

const GroupDetailClient = ({ group, userId, members, groupPlaylists, myPlaylists }: Props) => {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isOwner = group.created_by === userId;

  const handleLeave = () => {
    const msg = isOwner ? "그룹을 삭제할까요?" : "그룹에서 나갈까요?";
    if (!confirm(msg)) return;
    startTransition(async () => {
      await leaveGroup(group.id);
      router.push("/home");
    });
  };

  const handleRemovePlaylist = (playlistId: string) => {
    startTransition(async () => {
      await removePlaylistFromGroup(playlistId, group.id);
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.invite_code);
    alert(`초대 코드 복사됨: ${group.invite_code}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-2 p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <h1 className="flex-1 text-lg font-semibold truncate">{group.name}</h1>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyCode}>
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          {group.invite_code}
        </Button>
      </header>

      <main className="flex-1 px-4 pb-24 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">플레이리스트</h2>
          {groupPlaylists.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground py-4 text-center"
            >
              아직 플레이리스트가 없어요
            </motion.p>
          ) : (
            <motion.div
              className="grid gap-3"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {groupPlaylists.map(({ Playlist: playlist }) => (
                <motion.div key={playlist.id} variants={itemVariants}>
                  <Card size="sm" className="hover:ring-foreground/20 transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/playlist/${playlist.id}`} className="flex-1 min-w-0">
                          <CardTitle className="truncate">{playlist.title}</CardTitle>
                          <CardDescription>
                            {playlist.User?.nickname} · {playlist.Track?.[0]?.count ?? 0}곡
                          </CardDescription>
                        </Link>
                        {playlist.user_id === userId && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={isPending}
                            onClick={() => handleRemovePlaylist(playlist.id)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            멤버 {members.length}명
          </h2>
          <motion.div
            className="space-y-2"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {members.map((member) => (
              <motion.div
                key={member.user_id}
                variants={itemVariants}
                className="flex items-center gap-3 py-1"
              >
                <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {member.User.nickname[0]}
                </div>
                <span className="text-sm">{member.User.nickname}</span>
                {member.user_id === group.created_by && (
                  <span className="text-xs text-muted-foreground">방장</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Button variant="destructive" className="w-full" disabled={isPending} onClick={handleLeave}>
          {isOwner ? "그룹 삭제" : "그룹 나가기"}
        </Button>
      </main>

      <div className="fixed bottom-6 right-6">
        <Button size="icon-lg" className="rounded-full shadow-lg" onClick={() => setAddOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
        </Button>
      </div>

      <AddPlaylistToGroupDialog
        groupId={group.id}
        myPlaylists={myPlaylists}
        alreadyAdded={groupPlaylists.map((gp) => gp.Playlist.id)}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  );
};

export default GroupDetailClient;
