import { Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useColorTheme, type ColorTheme } from '@/hooks/use-color-theme';
import { cn } from '@/lib/utils';

const colorThemes: { name: ColorTheme; label: string; colors: string }[] = [
  { name: 'zinc', label: 'Zinc', colors: 'bg-zinc-500' },
  { name: 'slate', label: 'Slate', colors: 'bg-slate-500' },
  { name: 'stone', label: 'Stone', colors: 'bg-stone-500' },
  { name: 'gray', label: 'Gray', colors: 'bg-gray-500' },
  { name: 'neutral', label: 'Neutral', colors: 'bg-neutral-500' },
  { name: 'red', label: 'Red', colors: 'bg-red-500' },
  { name: 'rose', label: 'Rose', colors: 'bg-rose-500' },
  { name: 'orange', label: 'Orange', colors: 'bg-orange-500' },
  { name: 'green', label: 'Green', colors: 'bg-green-500' },
  { name: 'blue', label: 'Blue', colors: 'bg-blue-500' },
  { name: 'yellow', label: 'Yellow', colors: 'bg-yellow-500' },
  { name: 'violet', label: 'Violet', colors: 'bg-violet-500' },
];

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setColorTheme(theme.name)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded-full', theme.colors)} />
              <span>{theme.label}</span>
            </div>
            {colorTheme === theme.name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
