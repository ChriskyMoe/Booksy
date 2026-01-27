import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Edit,
  Search,
  Bell,
  Settings,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function StyleGuide() {
  const colorTokens = [
    { name: "Primary", var: "primary", class: "bg-primary", textClass: "text-primary-foreground" },
    { name: "Secondary", var: "secondary", class: "bg-secondary", textClass: "text-secondary-foreground" },
    { name: "Accent", var: "accent", class: "bg-accent", textClass: "text-accent-foreground" },
    { name: "Success", var: "success", class: "bg-success", textClass: "text-success-foreground" },
    { name: "Warning", var: "warning", class: "bg-warning", textClass: "text-warning-foreground" },
    { name: "Destructive", var: "destructive", class: "bg-destructive", textClass: "text-destructive-foreground" },
    { name: "Muted", var: "muted", class: "bg-muted", textClass: "text-muted-foreground" },
  ];

  const neutralTokens = [
    { name: "Background", class: "bg-background", border: true },
    { name: "Foreground", class: "bg-foreground" },
    { name: "Card", class: "bg-card", border: true },
    { name: "Popover", class: "bg-popover", border: true },
    { name: "Border", class: "bg-border" },
    { name: "Input", class: "bg-input" },
    { name: "Ring", class: "bg-ring" },
  ];

  const sidebarTokens = [
    { name: "Sidebar BG", class: "bg-sidebar" },
    { name: "Sidebar Primary", class: "bg-sidebar-primary" },
    { name: "Sidebar Accent", class: "bg-sidebar-accent" },
    { name: "Sidebar Border", class: "bg-sidebar-border" },
  ];

  const chartColors = [
    { name: "Chart 1", class: "bg-chart-1" },
    { name: "Chart 2", class: "bg-chart-2" },
    { name: "Chart 3", class: "bg-chart-3" },
    { name: "Chart 4", class: "bg-chart-4" },
    { name: "Chart 5", class: "bg-chart-5" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Style Guide"
        subtitle="Design system reference for BookKeeper"
      />

      <div className="p-6 space-y-12 max-w-7xl mx-auto">
        {/* Typography */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Typography
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">h1</span>
                  <h1 className="text-4xl font-bold text-foreground">The quick brown fox</h1>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">h2</span>
                  <h2 className="text-3xl font-semibold text-foreground">The quick brown fox</h2>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">h3</span>
                  <h3 className="text-2xl font-semibold text-foreground">The quick brown fox</h3>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">h4</span>
                  <h4 className="text-xl font-semibold text-foreground">The quick brown fox</h4>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">Body</span>
                  <p className="text-base text-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">Small</span>
                  <p className="text-sm text-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <Separator />
                <div className="flex items-baseline gap-4">
                  <span className="w-24 text-sm text-muted-foreground">Muted</span>
                  <p className="text-sm text-muted-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" />
            Color Palette
          </h2>

          {/* Semantic Colors */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-foreground">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {colorTokens.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className={`h-20 rounded-lg ${color.class} flex items-end p-2 shadow-sm`}
                  >
                    <span className={`text-xs font-medium ${color.textClass}`}>
                      {color.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">--{color.var}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-foreground">Neutral Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {neutralTokens.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className={`h-20 rounded-lg ${color.class} ${color.border ? "border border-border" : ""} shadow-sm`}
                  />
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Colors */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-foreground">Sidebar Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sidebarTokens.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={`h-20 rounded-lg ${color.class} shadow-sm`} />
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Chart Colors</h3>
            <div className="grid grid-cols-5 gap-4">
              {chartColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={`h-20 rounded-lg ${color.class} shadow-sm`} />
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            Buttons
          </h2>
          <Card>
            <CardContent className="p-6 space-y-8">
              {/* Variants */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button><Plus className="h-4 w-4 mr-2" />Create New</Button>
                  <Button variant="secondary"><Download className="h-4 w-4 mr-2" />Export</Button>
                  <Button variant="outline"><Edit className="h-4 w-4 mr-2" />Edit</Button>
                  <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>

              {/* States */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 border-border" />
            Cards
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the card content area. Use cards to group related information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-primary">Highlighted Card</CardTitle>
                <CardDescription>With primary border accent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use border colors to draw attention to important cards.
                </p>
              </CardContent>
            </Card>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stat Card</p>
                  <p className="text-2xl font-bold">$12,450</p>
                  <p className="text-xs text-success">+12% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Badges */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Badge>Badge</Badge>
            Badges & Status
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Status Badges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Invoice Status</h3>
                <div className="flex flex-wrap gap-4">
                  <StatusBadge status="draft" />
                  <StatusBadge status="sent" />
                  <StatusBadge status="paid" />
                  <StatusBadge status="overdue" />
                </div>
              </div>

              {/* Regular Badges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              {/* Custom Status Badges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Custom Indicators</h3>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    <Check className="h-3 w-3" /> Completed
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" /> Pending
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    <X className="h-3 w-3" /> Failed
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Info className="h-3 w-3" /> Info
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Form Elements
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Inputs</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default">Default Input</Label>
                      <Input id="default" placeholder="Enter text..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search">With Icon</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="search" placeholder="Search..." className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="disabled">Disabled</Label>
                      <Input id="disabled" placeholder="Disabled input" disabled />
                    </div>
                  </div>
                </div>

                {/* Selects & Textarea */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Selects & Textarea</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea id="textarea" placeholder="Enter description..." />
                    </div>
                  </div>
                </div>

                {/* Checkboxes & Switches */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Checkboxes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check1" />
                      <Label htmlFor="check1">Unchecked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check2" checked />
                      <Label htmlFor="check2">Checked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check3" disabled />
                      <Label htmlFor="check3" className="text-muted-foreground">Disabled</Label>
                    </div>
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Switches</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="switch1" />
                      <Label htmlFor="switch1">Off</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="switch2" checked />
                      <Label htmlFor="switch2">On</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="switch3" disabled />
                      <Label htmlFor="switch3" className="text-muted-foreground">Disabled</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Shadows & Effects */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground/20 shadow-lg" />
            Shadows & Effects
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <p className="text-sm font-medium">shadow-sm</p>
              <p className="text-xs text-muted-foreground mt-1">Subtle elevation</p>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-card">
              <p className="text-sm font-medium">shadow-card</p>
              <p className="text-xs text-muted-foreground mt-1">Card default</p>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-md">
              <p className="text-sm font-medium">shadow-md</p>
              <p className="text-xs text-muted-foreground mt-1">Medium elevation</p>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-elevated">
              <p className="text-sm font-medium">shadow-elevated</p>
              <p className="text-xs text-muted-foreground mt-1">High elevation</p>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="pb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full gradient-primary" />
            Gradients
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-24 rounded-xl gradient-primary flex items-end p-4">
              <span className="text-sm font-medium text-white">gradient-primary</span>
            </div>
            <div className="h-24 rounded-xl gradient-success flex items-end p-4">
              <span className="text-sm font-medium text-white">gradient-success</span>
            </div>
            <div className="h-24 rounded-xl gradient-accent flex items-end p-4">
              <span className="text-sm font-medium text-white">gradient-accent</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
