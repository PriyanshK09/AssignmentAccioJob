import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  FileCode,
  Github,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Package,
  Palette,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  Upload,
  User,
  X,
  Code,
  MessageSquare,
  Save,
  Share,
  RotateCcw,
  Play,
  type LucideIcon
} from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: Package,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  trash: Trash,
  edit: Edit,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  plus: Plus,
  warning: AlertCircle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Package,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  github: Github,
  twitter: Twitter,
  check: Check,
  copy: Copy,
  download: Download,
  upload: Upload,
  menu: Menu,
  logOut: LogOut,
  eye: Eye,
  code: Code,
  fileCode: FileCode,
  palette: Palette,
  message: MessageSquare,
  save: Save,
  share: Share,
  reset: RotateCcw,
  alertCircle: AlertCircle,
  play: Play,
  clock: Clock,
  google: Code, // Placeholder for Google icon, you can replace with actual Google icon
  monitor: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  ),
  tablet: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  ),
  smartphone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  ),
  refresh: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  )
} as const;