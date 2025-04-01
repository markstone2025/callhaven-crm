
import { useState } from "react";
import { DollarSign, ChevronDown, MoreHorizontal, User, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Contact {
  id: string;
  name: string;
  company: string;
  avatar?: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contact: Contact;
  dueDate?: string;
  createdDate: string;
  lastActivity?: string;
  description?: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

const initialStages: Stage[] = [
  {
    id: "1",
    name: "Lead",
    color: "bg-yellow-500",
    deals: [
      {
        id: "deal1",
        title: "Software License Renewal",
        value: 25000,
        stage: "Lead",
        probability: 20,
        contact: {
          id: "1",
          name: "John Doe",
          company: "Acme Inc.",
        },
        dueDate: "2023-07-15",
        createdDate: "2023-06-01",
        lastActivity: "2023-06-10",
        description: "Annual software license renewal for enterprise customers."
      },
      {
        id: "deal2",
        title: "Hardware Upgrade Project",
        value: 45000,
        stage: "Lead",
        probability: 15,
        contact: {
          id: "2",
          name: "Jane Smith",
          company: "Globex Corp",
        },
        dueDate: "2023-07-30",
        createdDate: "2023-06-05",
        lastActivity: "2023-06-12",
        description: "Complete hardware upgrade for their development team."
      }
    ]
  },
  {
    id: "2",
    name: "Qualified",
    color: "bg-blue-500",
    deals: [
      {
        id: "deal3",
        title: "Cloud Migration Services",
        value: 75000,
        stage: "Qualified",
        probability: 40,
        contact: {
          id: "3",
          name: "Robert Johnson",
          company: "Initech",
        },
        dueDate: "2023-08-10",
        createdDate: "2023-05-20",
        lastActivity: "2023-06-15",
        description: "Migration of on-premise infrastructure to cloud platform."
      }
    ]
  },
  {
    id: "3",
    name: "Proposal",
    color: "bg-indigo-500",
    deals: [
      {
        id: "deal4",
        title: "Cybersecurity Assessment",
        value: 35000,
        stage: "Proposal",
        probability: 60,
        contact: {
          id: "4",
          name: "Sarah Williams",
          company: "Massive Dynamic",
        },
        dueDate: "2023-07-05",
        createdDate: "2023-05-15",
        lastActivity: "2023-06-08",
        description: "Comprehensive security assessment and recommendations."
      }
    ]
  },
  {
    id: "4",
    name: "Negotiation",
    color: "bg-purple-500",
    deals: [
      {
        id: "deal5",
        title: "Enterprise CRM Implementation",
        value: 120000,
        stage: "Negotiation",
        probability: 80,
        contact: {
          id: "5",
          name: "Michael Brown",
          company: "Stark Industries",
        },
        dueDate: "2023-06-30",
        createdDate: "2023-04-10",
        lastActivity: "2023-06-18",
        description: "Full CRM implementation across all departments."
      }
    ]
  },
  {
    id: "5",
    name: "Closed Won",
    color: "bg-green-500",
    deals: [
      {
        id: "deal6",
        title: "Data Analytics Platform",
        value: 95000,
        stage: "Closed Won",
        probability: 100,
        contact: {
          id: "6",
          name: "Emily Davis",
          company: "Wayne Enterprises",
        },
        dueDate: "2023-05-30",
        createdDate: "2023-03-15",
        lastActivity: "2023-05-25",
        description: "Implementation of enterprise data analytics platform."
      }
    ]
  },
  {
    id: "6",
    name: "Closed Lost",
    color: "bg-red-500",
    deals: []
  }
];

export function SalesPipeline() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [isEditingStages, setIsEditingStages] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const totalValue = stages.reduce(
    (sum, stage) => sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0),
    0
  );

  const weightedValue = stages.reduce(
    (sum, stage) => sum + stage.deals.reduce((stageSum, deal) => stageSum + (deal.value * deal.probability / 100), 0),
    0
  );

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.setData("dealId", deal.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    if (!draggedDeal) return;
    
    const sourceStageId = stages.find(stage => 
      stage.deals.some(deal => deal.id === draggedDeal.id)
    )?.id;
    
    if (sourceStageId === targetStageId) return;
    
    const targetStage = stages.find(stage => stage.id === targetStageId);
    if (!targetStage) return;
    
    // Update the deal's stage name
    const updatedDeal = {
      ...draggedDeal,
      stage: targetStage.name,
      probability: getProbabilityByStage(targetStage.name)
    };
    
    // Remove from source stage and add to target stage
    setStages(stages.map(stage => {
      if (stage.id === sourceStageId) {
        return {
          ...stage,
          deals: stage.deals.filter(deal => deal.id !== draggedDeal.id)
        };
      }
      if (stage.id === targetStageId) {
        return {
          ...stage,
          deals: [...stage.deals, updatedDeal]
        };
      }
      return stage;
    }));
    
    setDraggedDeal(null);
  };

  const getProbabilityByStage = (stageName: string): number => {
    switch (stageName) {
      case "Lead": return 20;
      case "Qualified": return 40;
      case "Proposal": return 60;
      case "Negotiation": return 80;
      case "Closed Won": return 100;
      case "Closed Lost": return 0;
      default: return 50;
    }
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      color: "bg-gray-500", // Default color
      deals: []
    };
    
    setStages([...stages, newStage]);
    setNewStageName("");
  };

  const handleRemoveStage = (stageId: string) => {
    // Only remove if stage has no deals
    const stage = stages.find(s => s.id === stageId);
    if (stage && stage.deals.length === 0) {
      setStages(stages.filter(s => s.id !== stageId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your deals through the sales process
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingDeal} onOpenChange={setIsAddingDeal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Deal</DialogTitle>
                <DialogDescription>
                  Create a new deal in your sales pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="deal-title">Deal Name</Label>
                  <Input id="deal-title" placeholder="Enterprise license upgrade" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal-value">Value ($)</Label>
                  <Input id="deal-value" placeholder="25000" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal-stage">Stage</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal-contact">Contact</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact1">John Doe (Acme Inc.)</SelectItem>
                      <SelectItem value="contact2">Jane Smith (Globex Corp)</SelectItem>
                      <SelectItem value="contact3">Robert Johnson (Initech)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal-due-date">Due Date</Label>
                  <Input id="deal-due-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deal-description">Description</Label>
                  <Input id="deal-description" placeholder="Brief description of the deal" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingDeal(false)}>Cancel</Button>
                <Button>Create Deal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditingStages} onOpenChange={setIsEditingStages}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Customize Stages
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customize Pipeline Stages</DialogTitle>
                <DialogDescription>
                  Add, rename, or remove stages to match your sales process.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  {stages.map(stage => (
                    <div key={stage.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${stage.color}`}></div>
                        <span>{stage.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveStage(stage.id)}
                        disabled={stage.deals.length > 0}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={newStageName} 
                    onChange={e => setNewStageName(e.target.value)} 
                    placeholder="New stage name" 
                  />
                  <Button onClick={handleAddStage} size="sm">Add</Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsEditingStages(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
              {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {stages.reduce((count, stage) => count + stage.deals.length, 0)} active deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Weighted Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
              {weightedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on probability of closing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
              {(totalValue / Math.max(1, stages.reduce((count, stage) => count + stage.deals.length, 0))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current pipeline average
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {stages.map(stage => (
          <div 
            key={stage.id}
            className="flex-none w-80 rounded-md"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-medium text-sm">{stage.name}</h3>
                <Badge variant="outline" className="ml-1">
                  {stage.deals.length}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                ${stage.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-3">
              {stage.deals.map(deal => (
                <Card 
                  key={deal.id}
                  className="cursor-move hover:border-primary/50 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{deal.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Add Note</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Activity</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Mark as Lost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{deal.contact.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({deal.contact.company})
                      </span>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-baseline">
                      <div className="font-semibold text-sm flex items-center">
                        <DollarSign className="h-3.5 w-3.5" />
                        {deal.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {deal.dueDate && (
                          <>Due: {new Date(deal.dueDate).toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Probability: {deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {stage.deals.length === 0 && (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesPipeline;
