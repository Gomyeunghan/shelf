import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div>
      <Avatar></Avatar>
      <Badge />
      <Button>버튼</Button>
      <Card />
      <Dialog />
      <Input />
      <Sheet />
      <Tabs />
    </div>
  );
}
