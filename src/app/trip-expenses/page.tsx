
import { ExpenseCalculator } from "@/components/wanderlens/expense-calculator";

export default function TripExpensesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
                Trip Expense Calculator
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Easily calculate your total travel costs. Enter your expenses below to get a breakdown and grand total for your trip.
                </p>
            </div>
            <ExpenseCalculator />
        </div>
    )
}
