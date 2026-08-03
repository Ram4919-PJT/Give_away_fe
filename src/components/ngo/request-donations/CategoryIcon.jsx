import {
  Shirt, BookOpen, UtensilsCrossed, Stethoscope, Laptop, Sofa, Gamepad2, Droplets, Package,
  Snowflake, Sun, Baby, Bed, BedDouble, Footprints, CloudRain, GraduationCap, BookMarked,
  Library, FileText, NotebookPen, Backpack, Wheat, Flame, Candy, Circle, Heart, Pill, Cross,
  Accessibility, Shield, Hand, Monitor, Smartphone, Tablet, Printer, Projector, Keyboard, Mouse,
  Battery, Armchair, Table, Archive, Layers, Briefcase, Puzzle, Grid3x3, Dumbbell, Palette,
  Blocks, Music, TreePine, Smile, Bath, Sparkles
} from 'lucide-react';

const ICON_MAP = {
  Shirt, BookOpen, UtensilsCrossed, Stethoscope, Laptop, Sofa, Gamepad2, Droplets, Package,
  Snowflake, Sun, Baby, Bed, BedDouble, Footprints, CloudRain, GraduationCap, BookMarked,
  Library, FileText, NotebookPen, Backpack, Wheat, Flame, Candy, Circle, Heart, Pill, Cross,
  Accessibility, Shield, Hand, Monitor, Smartphone, Tablet, Printer, Projector, Keyboard, Mouse,
  Battery, Armchair, Table, Archive, Layers, Briefcase, Puzzle, Grid3x3, Dumbbell, Palette,
  Blocks, Music, TreePine, Smile, Bath, Sparkles
};

export default function CategoryIcon({ name, size = 22, strokeWidth = 1.75, className, style }) {
  const Cmp = ICON_MAP[name] || Package;
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}
