import { 
  Code2, 
  Loader2, 
  Plus, 
  MessageSquare, 
  Settings, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Eye,
  FileCode,
  Palette,
  Save,
  RotateCcw,
  Share,
  Github,
  type LucideIcon
} from 'lucide-react';

export const Icons = {
  code: Code2,
  spinner: Loader2,
  plus: Plus,
  message: MessageSquare,
  settings: Settings,
  download: Download,
  upload: Upload,
  sun: Sun,
  moon: Moon,
  menu: Menu,
  close: X,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  play: Play,
  eye: Eye,
  fileCode: FileCode,
  palette: Palette,
  save: Save,
  reset: RotateCcw,
  share: Share,
  github: Github,
  google: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
      />
    </svg>
  ),
} as const;

export type Icon = LucideIcon;
