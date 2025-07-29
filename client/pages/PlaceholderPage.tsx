import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl bg-card/60 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
              <Icons.fileCode className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page is coming soon! We're working on adding content here.
            </p>
            <p className="text-sm text-muted-foreground">
              Continue exploring the AI Frontend Playground to build amazing components.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/workspace" className="flex-1">
                <Button className="w-full">
                  Go to Workspace
                  <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
