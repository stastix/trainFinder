import { Train, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="p-1 rounded-lg bg-primary/10">
              <Train className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-none">
                TrainFinder
              </span>
              <span className="text-xs text-muted-foreground">
                Hamburg ⇄ Amsterdam
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
