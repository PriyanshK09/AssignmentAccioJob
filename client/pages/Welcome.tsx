import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { useLenis } from '@/hooks/useLenis';

export default function Welcome() {
  useLenis();

  const features = [
    {
      icon: Icons.message,
      title: "AI-Powered Chat",
      description: "Describe what you want to build and get instant React components with intelligent code generation",
      gradient: "from-primary/80 to-primary",
      delay: "0"
    },
    {
      icon: Icons.eye,
      title: "Live Preview",
      description: "See your components come to life with real-time rendering and instant visual feedback",
      gradient: "from-emerald-400 to-emerald-600",
      delay: "100"
    },
    {
      icon: Icons.fileCode,
      title: "Code Editor",
      description: "Edit and refine generated code with advanced syntax highlighting and IntelliSense",
      gradient: "from-amber-400 to-orange-500",
      delay: "200"
    },
    {
      icon: Icons.palette,
      title: "Style Customization",
      description: "Adjust props and styles with intuitive visual editors and live CSS manipulation",
      gradient: "from-pink-400 to-rose-500",
      delay: "300"
    },
    {
      icon: Icons.download,
      title: "Export & Deploy",
      description: "Download your code or deploy directly to Vercel with one-click deployment",
      gradient: "from-violet-400 to-purple-500",
      delay: "400"
    },
    {
      icon: Icons.save,
      title: "Session Management",
      description: "Save and organize your development sessions with version control and collaboration",
      gradient: "from-blue-400 to-indigo-500",
      delay: "500"
    }
  ];

  return (
    <div className="min-h-screen relative landing-scroll">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/3">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600/4 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-primary/3 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="relative z-50 border-b border-border/50 glass-subtle sticky top-0" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group" aria-label="AI Frontend Playground Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105" aria-hidden="true">
              <Icons.code className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              AI Frontend Playground
            </span>
          </Link>
          <nav className="flex items-center space-x-4" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => (window as any).lenis?.scrollTo('#features')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => (window as any).lenis?.scrollTo('#how-it-works')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => (window as any).lenis?.scrollTo('#examples')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Examples
            </button>
            <button
              onClick={() => (window as any).lenis?.scrollTo('#testimonials')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <Link to="/login">
              <Button variant="ghost" className="interactive" aria-label="Sign in to your account">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-primary shadow-lg group" aria-label="Create a new account">
                Get Started
                <Icons.chevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-section relative z-10 py-20 md:py-32" id="hero" aria-labelledby="hero-heading">
        <div className="container mx-auto px-6 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in-scale backdrop-blur-sm" role="banner">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true"></div>
            <span className="text-sm font-medium">AI-Powered Development Platform</span>
            <Icons.chevronRight className="w-3 h-3" aria-hidden="true" />
          </div>

          {/* Main Heading */}
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up max-w-4xl mx-auto">
            <span className="block text-foreground mb-2">Build Frontend Components</span>
            <span className="block text-foreground mb-2">with</span>
            <span className="block gradient-text bg-gradient-to-r from-primary to-primary-600">
              AI Assistance
            </span>
          </h1>

          {/* Subtitle */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up leading-relaxed" style={{animationDelay: '200ms'}}>
              Describe what you want to build and watch as our AI creates beautiful,
              responsive React components in real-time. Perfect for developers,
              designers, and anyone who wants to prototype quickly.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{animationDelay: '400ms'}}>
            <Link to="/signup" className="group">
              <Button size="lg" className="h-14 px-10 text-lg btn-primary shadow-lg relative overflow-hidden">
                <span className="relative z-10 flex items-center font-semibold">
                  Start Building Free
                  <Icons.chevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/login" className="group">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg interactive border-border/50 hover:border-primary/30">
                <Icons.play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 text-base text-muted-foreground animate-fade-in mb-16" style={{animationDelay: '600ms'}}>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-purple-600/80 border-2 border-background flex items-center justify-center text-sm font-medium text-white shadow-lg">
                    {i}
                  </div>
                ))}
              </div>
              <span className="font-medium">Trusted by 10,000+ developers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Icons.code key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <span className="font-medium">4.9/5 rating</span>
            </div>
          </div>

          {/* Hero Visual Elements */}
          <div className="relative max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '800ms'}}>
            <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-2xl p-1 shadow-2xl">
              <div className="bg-background rounded-xl p-6 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">AI Frontend Playground - Component Builder</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <div className="text-xs text-primary font-medium mb-1">Chat with AI</div>
                      <div className="text-sm text-foreground">"Create a modern button component with hover effects"</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Generated Code</div>
                      <div className="font-mono text-xs text-foreground">
                        {'<Button variant="primary" size="lg">'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">Live Preview</div>
                      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                        Generated Button
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm mb-6">
            <Icons.code className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
            Everything you need to{' '}
            <span className="gradient-text">build faster</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
            From idea to deployment, our AI-powered platform has all the tools
            you need for modern frontend development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto" role="list">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group animate-slide-up"
              style={{animationDelay: `${200 + parseInt(feature.delay)}ms`}}
              role="listitem"
            >
              <Card className="relative card-enhanced border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden h-full" tabIndex={0} aria-labelledby={`feature-${index}`}>
                {/* Gradient overlay */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br",
                    feature.gradient
                  )}
                  aria-hidden="true"
                />

                <CardContent className="relative p-8">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110",
                      "bg-gradient-to-br", feature.gradient,
                      "shadow-lg shadow-current/20"
                    )}
                    aria-hidden="true"
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 id={`feature-${index}`} className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" aria-hidden="true">
                    <span className="text-sm font-medium mr-2">Learn more</span>
                    <Icons.chevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-section relative z-10 py-24 md:py-32 bg-gradient-to-b from-background to-muted/20" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Icons.settings className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground max-w-4xl mx-auto">
              From idea to code in{' '}
              <span className="gradient-text">3 simple steps</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground">
                Our AI-powered workflow makes frontend development faster and more intuitive than ever before
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting lines */}
              <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>

              {[
                {
                  step: "01",
                  title: "Describe Your Vision",
                  description: "Simply tell our AI what component you want to build. Use natural language to describe the functionality, style, and behavior you need.",
                  icon: Icons.message,
                  color: "from-blue-500 to-blue-600"
                },
                {
                  step: "02",
                  title: "AI Generates Code",
                  description: "Our advanced AI analyzes your request and generates clean, modern React code with proper TypeScript types and responsive design.",
                  icon: Icons.code,
                  color: "from-purple-500 to-purple-600"
                },
                {
                  step: "03",
                  title: "Preview & Refine",
                  description: "See your component come to life instantly. Make adjustments, customize styles, and export when you're happy with the result.",
                  icon: Icons.eye,
                  color: "from-green-500 to-green-600"
                }
              ].map((step, index) => (
                <div key={index} className="relative group animate-slide-up" style={{animationDelay: `${index * 200}ms`}}>
                  <div className="text-center">
                    {/* Step number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 mb-6 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                      <span className="text-2xl font-bold text-primary">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 text-white shadow-lg transition-all duration-300 group-hover:scale-110",
                      "bg-gradient-to-br", step.color
                    )}>
                      <step.icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-10 text-lg btn-primary shadow-lg">
                Try It Now - It's Free
                <Icons.chevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="landing-section relative z-10 py-24 md:py-32" id="examples">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm mb-6">
              <Icons.fileCode className="w-4 h-4" />
              Code Examples
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground max-w-4xl mx-auto">
              See the quality of{' '}
              <span className="gradient-text">generated code</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground">
                Clean, modern, and production-ready code that follows best practices
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Example prompts */}
              <div className="space-y-6">
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icons.message className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-2">Example Prompt</div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Create a modern pricing card component with three tiers - Basic, Pro, and Enterprise. Include features list, monthly pricing, and a call-to-action button for each tier."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Icons.code className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-2">Generated Output</div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Clean TypeScript React component with proper types, responsive design, and modern styling
                      </p>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                        <div className="text-primary">interface PricingTier {`{`}</div>
                        <div className="pl-4 text-muted-foreground">name: string;</div>
                        <div className="pl-4 text-muted-foreground">price: number;</div>
                        <div className="pl-4 text-muted-foreground">features: string[];</div>
                        <div className="text-primary">{`}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live preview mockup */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8">
                <div className="bg-background rounded-lg p-6 shadow-xl border border-border/50">
                  <div className="text-center mb-6">
                    <div className="text-xs text-muted-foreground mb-2">Live Preview</div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {["Basic", "Pro", "Enterprise"].map((tier, i) => (
                      <div key={tier} className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-sm font-semibold mb-2">{tier}</div>
                        <div className="text-2xl font-bold text-primary mb-3">${[9, 29, 99][i]}</div>
                        <div className="space-y-2 mb-4">
                          {Array.from({length: 3}).map((_, j) => (
                            <div key={j} className="h-2 bg-muted rounded"></div>
                          ))}
                        </div>
                        <div className="h-8 bg-primary/20 rounded text-xs flex items-center justify-center text-primary font-medium">
                          Choose Plan
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 md:py-32 bg-muted/30" id="testimonials">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Icons.message className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground max-w-4xl mx-auto">
              Loved by developers{' '}
              <span className="gradient-text">worldwide</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground">
                See what developers are saying about their experience with our AI-powered platform
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "This tool has revolutionized my development workflow. I can prototype components in minutes instead of hours.",
                author: "Sarah Chen",
                role: "Frontend Developer",
                company: "TechCorp",
                avatar: "1"
              },
              {
                quote: "The AI understands exactly what I need. It's like having a senior developer pair programming with me.",
                author: "Marcus Rodriguez",
                role: "Full-Stack Engineer",
                company: "StartupXYZ",
                avatar: "2"
              },
              {
                quote: "Amazing for rapid prototyping. Our design-to-code time has decreased by 80% since we started using this.",
                author: "Emily Johnson",
                role: "Product Designer",
                company: "DesignStudio",
                avatar: "3"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="bg-background rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
                  <div className="flex mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Icons.code key={star} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-purple-600/80 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm mb-6">
            <Icons.play className="w-4 h-4" />
            Live Demo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
            See it in <span className="gradient-text">action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '100ms'}}>
            Watch how quickly you can go from idea to working component
          </p>
        </div>

        <div className="max-w-7xl mx-auto animate-slide-up" style={{animationDelay: '200ms'}}>
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 shadow-2xl">
            <div className="glass rounded-3xl p-8 bg-card/50">
              {/* Browser Header */}
              <div className="flex items-center space-x-3 mb-8 p-4 bg-muted/30 rounded-xl">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4 h-6 bg-background rounded-md flex items-center px-3">
                  <Icons.code className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">AI Frontend Playground</span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Chat Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-sm font-medium text-muted-foreground mb-4">Chat Interface</div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-md max-w-xs shadow-lg">
                      <div className="text-sm font-medium mb-1">You</div>
                      <div className="text-sm">Create a modern pricing card component with gradient background</div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-muted/80 p-4 rounded-2xl rounded-tl-md max-w-xs shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icons.code className="w-3 h-3 text-primary" />
                        </div>
                        <div className="text-sm font-medium">AI Assistant</div>
                      </div>
                      <div className="text-sm">I'll create a beautiful pricing card with modern styling and gradients...</div>
                      <div className="mt-3 p-2 bg-background rounded-lg border">
                        <code className="text-xs font-mono text-muted-foreground">
                          {'<PricingCard variant="pro" />'}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-md shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">AI is generating...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-3">
                  <div className="text-sm font-medium text-muted-foreground mb-4">Live Preview</div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 shadow-lg min-h-80 flex items-center justify-center">
                    {/* Generated Component Preview */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white mb-4">
                            <Icons.code className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro Plan</h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">Perfect for teams</p>
                          <div className="mb-6">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">$29</span>
                            <span className="text-slate-600 dark:text-slate-400">/month</span>
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105">
                            Choose Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 md:py-32" id="stats">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Trusted by developers{' '}
              <span className="gradient-text">everywhere</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are building faster with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10,000+", label: "Active Developers", icon: Icons.code },
              { number: "100K+", label: "Components Generated", icon: Icons.fileCode },
              { number: "99.9%", label: "Uptime", icon: Icons.eye },
              { number: "4.9/5", label: "User Rating", icon: Icons.save }
            ].map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-600/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="relative z-10 py-20 md:py-32 bg-muted/20" id="integrations">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Icons.settings className="w-4 h-4" />
              Integrations
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground max-w-4xl mx-auto">
              Works with your{' '}
              <span className="gradient-text">favorite tools</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground">
                Seamlessly integrate with the tools and platforms you already use
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
            {[
              "React", "Vue", "Angular", "Svelte", "Next.js", "Vite",
              "TypeScript", "Tailwind", "GitHub", "Vercel", "Netlify", "Figma"
            ].map((tool, index) => (
              <div key={tool} className="flex flex-col items-center group animate-slide-up" style={{animationDelay: `${index * 50}ms`}}>
                <div className="w-16 h-16 bg-background rounded-2xl border border-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                    <Icons.code className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {tool}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 rounded-3xl"></div>

          <div className="relative glass-subtle rounded-3xl p-12 lg:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
                <Icons.code className="w-4 h-4" />
                <span className="text-sm font-medium">Start Building Today</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up text-foreground">
                Ready to build something{' '}
                <span className="gradient-text">amazing?</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '100ms'}}>
                Join thousands of developers using AI to accelerate their frontend development.
                Start building beautiful components in minutes, not hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '200ms'}}>
                <Link to="/signup" className="group">
                  <Button size="lg" className="h-14 px-10 text-lg btn-primary glow">
                    <span className="flex items-center">
                      Start Building for Free
                      <Icons.chevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <div className="text-sm text-muted-foreground">
                  No credit card required • Free forever plan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center">
                  <Icons.code className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">AI Frontend Playground</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build beautiful React components with AI assistance.
                The future of frontend development is here.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/workspace" className="block text-muted-foreground hover:text-primary transition-colors">
                  Playground
                </Link>
                <Link to="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
                <Link to="/examples" className="block text-muted-foreground hover:text-primary transition-colors">
                  Examples
                </Link>
                <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link to="/careers" className="block text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/cookies" className="block text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 AI Frontend Playground. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.github className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.message className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => (window as any).lenis?.scrollTo(0)}
        className="scroll-to-top-btn fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl z-50 opacity-90 hover:opacity-100 transition-opacity"
        aria-label="Scroll to top"
      >
        <Icons.chevronRight className="w-6 h-6 transform -rotate-90" />
      </button>
    </div>
  );
}
