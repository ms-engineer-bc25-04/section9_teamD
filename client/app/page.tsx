import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-800">shadcn/ui ボタンテスト</h1>
      <Button>こんにちは！</Button>
    </main>
  );
}

