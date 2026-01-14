import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ListFilter, ArrowUpDown, Hourglass } from "lucide-react"

export function UpcomingDeadlines() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
           <Hourglass className="h-4 w-4" /> Upcoming Deadlines
        </CardTitle>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
               <Search className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
               <ArrowUpDown className="h-3.5 w-3.5" /> Sort
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
               <ListFilter className="h-3.5 w-3.5" /> Filter
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px] text-xs font-semibold">Course / Task</TableHead>
              <TableHead className="text-xs font-semibold">Due Date</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    <span className="text-sm">Introduction to Python</span>
                 </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">2025-10-08</TableCell>
              <TableCell className="text-xs text-muted-foreground">Assignment</TableCell>
              <TableCell>
                 <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-100 text-[10px] font-normal px-2">Pending</Badge>
              </TableCell>
              <TableCell className="text-right text-xs">High</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm">Modern Web Development</span>
                 </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">2025-10-10</TableCell>
              <TableCell className="text-xs text-muted-foreground">Quiz</TableCell>
              <TableCell>
                 <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-100 text-[10px] font-normal px-2">Not Started</Badge>
              </TableCell>
              <TableCell className="text-right text-xs">Medium</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <span className="text-sm">Data Science Fundamentals</span>
                 </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">2025-10-12</TableCell>
              <TableCell className="text-xs text-muted-foreground">Project</TableCell>
              <TableCell>
                 <Badge variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-100 text-[10px] font-normal px-2">In Progress</Badge>
              </TableCell>
              <TableCell className="text-right text-xs">High</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
