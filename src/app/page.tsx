import { TrainSearch } from "@/components/train-search";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Hamburg ⇄ Amsterdam Train Finder
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Find the best train connections between Hamburg and Amsterdam.
              Compare prices, travel times, and book your perfect journey.
            </p>
          </div>
          <TrainSearch />
        </div>
      </main>
    </div>
  );
}
