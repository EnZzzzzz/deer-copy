import { Sidebar } from "@/components/workspace/sidebar";
import { WelcomeScreen } from "@/components/workspace/welcome-screen";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <WelcomeScreen />
      </main>
    </div>
  );
}
