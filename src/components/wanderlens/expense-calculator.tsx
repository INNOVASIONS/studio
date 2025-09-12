
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bed,
  Utensils,
  Plane,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  CircleDollarSign,
  Landmark,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { RupeeIcon } from './rupee-icon';

const currencies = [
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'JPY', label: '¥ JPY' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'INR', label: '₹ INR' },
  { value: 'AUD', label: '$ AUD' },
  { value: 'CAD', label: '$ CAD' },
  { value: 'CHF', label: 'Fr CHF' },
  { value: 'CNY', label: '¥ CNY' },
  { value: 'SEK', label: 'kr SEK' },
  { value: 'NZD', label: '$ NZD' },
  { value: 'KRW', label: '₩ KRW' },
  { value: 'SGD', label: '$ SGD' },
  { value: 'NOK', label: 'kr NOK' },
  { value: 'MXN', label: '$ MXN' },
  { value: 'BRL', label: 'R$ BRL' },
  { value: 'ZAR', label: 'R ZAR' },
];

const expenseCategories = [
  {
    id: 'accommodation',
    label: 'Accommodation',
    icon: Bed,
    placeholder: 'e.g., 800',
  },
  {
    id: 'food',
    label: 'Food & Drinks',
    icon: Utensils,
    placeholder: 'e.g., 350',
  },
  {
    id: 'transport',
    label: 'Transportation',
    icon: Plane,
    placeholder: 'e.g., 1200',
  },
  {
    id: 'activities',
    label: 'Activities & Tickets',
    icon: Ticket,
    placeholder: 'e.g., 150',
  },
  {
    id: 'shopping',
    label: 'Shopping & Souvenirs',
    icon: ShoppingBag,
    placeholder: 'e.g., 200',
  },
  {
    id: 'other',
    label: 'Other',
    icon: MoreHorizontal,
    placeholder: 'e.g., 75',
  },
];

type Expenses = {
  [key: string]: number;
};

export function ExpenseCalculator() {
  const [expenses, setExpenses] = useState<Expenses>({});
  const [currency, setCurrency] = useState('USD');

  const handleExpenseChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setExpenses((prev) => ({ ...prev, [id]: numericValue }));
  };

  const totalExpense = useMemo(() => {
    return Object.values(expenses).reduce((acc, curr) => acc + curr, 0);
  }, [expenses]);
  
  const selectedCurrencySymbol = useMemo(() => {
     if (currency === 'INR') {
      return <RupeeIcon className="inline-block h-4 w-4" />;
    }
    return currencies.find(c => c.value === currency)?.label.split(' ')[0] || '$';
  }, [currency]);

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Enter Expenses</CardTitle>
          <CardDescription>
            Input your costs for each category. The total will update automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
              <Label htmlFor="currency-select" className="flex items-center gap-2 font-semibold">
                <Landmark className="h-5 w-5 text-primary" />
                Select Currency
              </Label>
              <Select onValueChange={setCurrency} defaultValue={currency}>
                <SelectTrigger id="currency-select">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {currencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

          <Separator />
          
          <div className="space-y-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-4">
                <category.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor={category.id}>{category.label}</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">{selectedCurrencySymbol}</span>
                    <Input
                      id={category.id}
                      type="number"
                      placeholder={category.placeholder}
                      value={expenses[category.id] || ''}
                      onChange={(e) => handleExpenseChange(category.id, e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{category.label}</span>
                  <span className="font-medium flex items-center gap-1">
                    {selectedCurrencySymbol}
                    {(expenses[category.id] || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 border-t pt-6">
             <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold flex items-center gap-2">
                    <CircleDollarSign className="h-6 w-6 text-primary"/>
                    Grand Total
                </span>
                <span className="text-3xl font-bold text-primary flex items-center gap-1">
                    {selectedCurrencySymbol}
                    {totalExpense.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })}
                </span>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
