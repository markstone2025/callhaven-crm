
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ContactFilterOptions = {
  name?: string;
  company?: string;
  industry?: string;
  country?: string;
  minRevenue?: number;
  status?: string;
  score?: number;
  sortBy?: string;
};

interface ContactFiltersProps {
  filters: ContactFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<ContactFilterOptions>>;
  industries: string[];
  countries: string[];
}

export function ContactFilters({
  filters,
  setFilters,
  industries,
  countries
}: ContactFiltersProps) {
  const [customFilters, setCustomFilters] = useState<{name: string, value: string}[]>([]);
  const [newFilterName, setNewFilterName] = useState("");
  const [newFilterValue, setNewFilterValue] = useState("");

  const clearFilters = () => {
    setFilters({});
    setCustomFilters([]);
  };

  const handleAddCustomFilter = () => {
    if (newFilterName && newFilterValue) {
      setCustomFilters([...customFilters, {
        name: newFilterName,
        value: newFilterValue
      }]);
      setNewFilterName("");
      setNewFilterValue("");
    }
  };

  const removeCustomFilter = (index: number) => {
    setCustomFilters(customFilters.filter((_, i) => i !== index));
  };

  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key as keyof ContactFilterOptions] !== undefined && 
    filters[key as keyof ContactFilterOptions] !== ""
  ).length + customFilters.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filter Contacts</h4>
                <p className="text-sm text-muted-foreground">
                  Narrow down contacts by specific criteria
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="company" className="text-xs col-span-1">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={filters.company || ""}
                    className="col-span-3 h-8"
                    onChange={(e) => setFilters({...filters, company: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="industry" className="text-xs col-span-1">
                    Industry
                  </Label>
                  <Select 
                    onValueChange={(value) => setFilters({...filters, industry: value})}
                    value={filters.industry || ""}
                  >
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Any industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any industry</SelectItem>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="country" className="text-xs col-span-1">
                    Country
                  </Label>
                  <Select 
                    onValueChange={(value) => setFilters({...filters, country: value})}
                    value={filters.country || ""}
                  >
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Any country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any country</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="revenue" className="text-xs col-span-1">
                    Min Revenue
                  </Label>
                  <Select 
                    onValueChange={(value) => setFilters({...filters, minRevenue: Number(value) || undefined})}
                    value={filters.minRevenue?.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Any amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any amount</SelectItem>
                      <SelectItem value="10000">$10,000+</SelectItem>
                      <SelectItem value="50000">$50,000+</SelectItem>
                      <SelectItem value="100000">$100,000+</SelectItem>
                      <SelectItem value="500000">$500,000+</SelectItem>
                      <SelectItem value="1000000">$1,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="status" className="text-xs col-span-1">
                    Status
                  </Label>
                  <Select 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                    value={filters.status || ""}
                  >
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any status</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="score" className="text-xs col-span-1">
                    Min Score
                  </Label>
                  <Select 
                    onValueChange={(value) => setFilters({...filters, score: Number(value) || undefined})}
                    value={filters.score?.toString() || ""}
                  >
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Any score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any score</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom filters section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm leading-none">Custom Filters</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={handleAddCustomFilter}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="Name"
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                    className="col-span-2 h-8 text-sm"
                  />
                  <Input
                    placeholder="Value"
                    value={newFilterValue}
                    onChange={(e) => setNewFilterValue(e.target.value)}
                    className="col-span-2 h-8 text-sm"
                  />
                </div>
                
                {customFilters.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {customFilters.map((filter, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="text-xs">
                          <span className="font-medium">{filter.name}:</span> {filter.value}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => removeCustomFilter(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={filters.sortBy || "newest"}
              onValueChange={(value) => setFilters({...filters, sortBy: value})}
            >
              <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="nameDesc">Name (Z-A)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="company">Company (A-Z)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="score">Score (High-Low)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="scoreAsc">Score (Low-High)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="revenueDesc">Revenue (High-Low)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="revenueAsc">Revenue (Low-High)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
