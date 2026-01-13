import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Coins,
  Receipt,
  Calculator,
  Target,
  Percent,
  Activity,
  Landmark,
  Building2,
  ShoppingCart,
  ShoppingBag,
  Home,
  Car,
  Plane,
  Utensils,
  Zap,
  Smartphone,
  Wifi,
  Heart,
  GraduationCap,
  Briefcase,
  Gift,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Financial
  wallet: Wallet,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "dollar-sign": DollarSign,
  dollar: DollarSign,
  "credit-card": CreditCard,
  card: CreditCard,
  "piggy-bank": PiggyBank,
  piggy: PiggyBank,
  savings: PiggyBank,
  
  // Charts
  "bar-chart": BarChart3,
  bar: BarChart3,
  "line-chart": LineChart,
  line: LineChart,
  "pie-chart": PieChart,
  pie: PieChart,
  
  // Arrows
  "arrow-up": ArrowUpRight,
  "arrow-down": ArrowDownRight,
  up: ArrowUpRight,
  down: ArrowDownRight,
  
  // Money
  banknote: Banknote,
  money: Banknote,
  coins: Coins,
  receipt: Receipt,
  calculator: Calculator,
  
  // Goals
  target: Target,
  goal: Target,
  percent: Percent,
  percentage: Percent,
  activity: Activity,
  
  // Institutions
  bank: Landmark,
  landmark: Landmark,
  building: Building2,
  company: Building2,
  
  // Shopping
  cart: ShoppingCart,
  "shopping-cart": ShoppingCart,
  bag: ShoppingBag,
  "shopping-bag": ShoppingBag,
  
  // Categories
  home: Home,
  house: Home,
  car: Car,
  vehicle: Car,
  plane: Plane,
  travel: Plane,
  food: Utensils,
  restaurant: Utensils,
  utilities: Zap,
  energy: Zap,
  phone: Smartphone,
  internet: Wifi,
  wifi: Wifi,
  health: Heart,
  medical: Heart,
  education: GraduationCap,
  school: GraduationCap,
  work: Briefcase,
  business: Briefcase,
  gift: Gift,
  
  // Time
  calendar: Calendar,
  date: Calendar,
  clock: Clock,
  time: Clock,
  
  // Status
  alert: AlertCircle,
  warning: AlertCircle,
  success: CheckCircle,
  check: CheckCircle,
  error: XCircle,
  close: XCircle,
  info: Info,
  help: HelpCircle,
};

export function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Wallet;
  
  const normalizedName = iconName.toLowerCase().trim();
  return iconMap[normalizedName] || Wallet;
}

export default iconMap;
