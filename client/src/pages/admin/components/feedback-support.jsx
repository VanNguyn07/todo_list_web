"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { CheckCircle2, Clock, AlertCircle, Hourglass, MessageSquare, User, Mail, History, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

type FeedbackStatus = "pending" | "in-progress" | "resolved" | "waiting"

interface HistoryEntry {
  id: string
  status: FeedbackStatus
  response: string
  timestamp: Date
  respondedBy: string
}

interface Feedback {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  message: string
  status: FeedbackStatus
  createdAt: Date
  updatedAt: Date
  history: HistoryEntry[]
}

const initialFeedback: Feedback[] = [
  {
    id: "FB001",
    user: { name: "John Doe", email: "john@example.com" },
    subject: "Unable to login",
    message: "I'm having trouble logging into my account. The password reset isn't working.",
    status: "pending",
    createdAt: new Date("2025-01-05T10:30:00"),
    updatedAt: new Date("2025-01-05T10:30:00"),
    history: [],
  },
  {
    id: "FB002",
    user: { name: "Jane Smith", email: "jane@example.com" },
    subject: "Payment failed",
    message: "My payment was declined but the amount was deducted from my account.",
    status: "in-progress",
    createdAt: new Date("2025-01-04T14:20:00"),
    updatedAt: new Date("2025-01-05T09:15:00"),
    history: [
      {
        id: "H001",
        status: "in-progress",
        response: "We are investigating your payment issue. Please provide the transaction ID.",
        timestamp: new Date("2025-01-05T09:15:00"),
        respondedBy: "Admin",
      },
    ],
  },
  {
    id: "FB003",
    user: { name: "Mike Johnson", email: "mike@example.com" },
    subject: "Feature request",
    message: "It would be great to have a dark mode option in the app.",
    status: "resolved",
    createdAt: new Date("2025-01-02T08:45:00"),
    updatedAt: new Date("2025-01-03T16:30:00"),
    history: [
      {
        id: "H002",
        status: "in-progress",
        response: "Thank you for your suggestion! We're considering this for our next update.",
        timestamp: new Date("2025-01-02T11:00:00"),
        respondedBy: "Admin",
      },
      {
        id: "H003",
        status: "resolved",
        response: "Dark mode has been added to our roadmap for Q2 2025. Thank you for your feedback!",
        timestamp: new Date("2025-01-03T16:30:00"),
        respondedBy: "Admin",
      },
    ],
  },
  {
    id: "FB004",
    user: { name: "Sarah Williams", email: "sarah@example.com" },
    subject: "Account verification",
    message: "I submitted my documents but haven't received verification confirmation.",
    status: "waiting",
    createdAt: new Date("2025-01-06T11:00:00"),
    updatedAt: new Date("2025-01-06T14:00:00"),
    history: [
      {
        id: "H004",
        status: "in-progress",
        response: "Your documents are under review. We will update you within 24 hours.",
        timestamp: new Date("2025-01-06T14:00:00"),
        respondedBy: "Admin",
      },
    ],
  },
  {
    id: "FB005",
    user: { name: "Tom Brown", email: "tom@example.com" },
    subject: "Bug report",
    message: "The search function is not returning correct results.",
    status: "pending",
    createdAt: new Date("2025-01-06T15:30:00"),
    updatedAt: new Date("2025-01-06T15:30:00"),
    history: [],
  },
]

const statusConfig: Record<
  FeedbackStatus,
  { label: string; color: string; icon: React.ReactNode; description: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <AlertCircle className="size-3" />,
    description: "New feedback waiting for admin response",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Hourglass className="size-3" />,
    description: "Admin is working on this feedback",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="size-3" />,
    description: "Feedback has been resolved successfully",
  },
  waiting: {
    label: "Waiting",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <Clock className="size-3" />,
    description: "User has arrived - review response history",
  },
}

export default function FeedbackSupport() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(initialFeedback)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [responseContent, setResponseContent] = useState("")
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all")
  const { toast } = useToast()

  const filteredFeedback = useMemo(() => {
    if (statusFilter === "all") return feedbackList
    return feedbackList.filter((fb) => fb.status === statusFilter)
  }, [feedbackList, statusFilter])

  const handleOpenResolveModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setResponseContent("")
    setIsResolveModalOpen(true)
  }

  const handleOpenHistoryModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsHistoryModalOpen(true)
  }

  const handleRespondToUser = () => {
    if (!selectedFeedback || !responseContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a response message",
      })
      return
    }

    const newHistoryEntry: HistoryEntry = {
      id: `H${Date.now()}`,
      status: "in-progress",
      response: responseContent,
      timestamp: new Date(),
      respondedBy: "Admin",
    }

    setFeedbackList((prev) =>
      prev.map((fb) =>
        fb.id === selectedFeedback.id
          ? {
              ...fb,
              status: "in-progress" as FeedbackStatus,
              updatedAt: new Date(),
              history: [...fb.history, newHistoryEntry],
            }
          : fb,
      ),
    )

    toast({
      title: "Success",
      description: `Response sent to ${selectedFeedback.user.name}. Status set to In Progress.`,
    })
    setIsResolveModalOpen(false)
    setResponseContent("")
    setSelectedFeedback(null)
  }

  const handleStatusChange = (feedbackId: string, newStatus: FeedbackStatus) => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === feedbackId ? { ...fb, status: newStatus, updatedAt: new Date() } : fb)),
    )
    toast({
      title: "Success",
      description: `Feedback status updated to ${statusConfig[newStatus].label}`,
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Feedback & Support</h2>
          <p className="text-sm text-gray-500">Manage user feedback and support tickets</p>
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Filter: {statusFilter === "all" ? "All Status" : statusConfig[statusFilter]?.label || statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => setStatusFilter(key as FeedbackStatus)}>
                <span className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <Badge className={`gap-1 ${config.color}`}>
              {config.icon}
              {config.label}
            </Badge>
            <span className="text-xs text-gray-500">{config.description}</span>
          </div>
        ))}
      </div>

      {/* Feedback Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User Info</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No feedback found matching the criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                        <User className="size-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{feedback.user.name}</p>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="size-3" />
                          {feedback.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{feedback.subject}</p>
                      <p className="line-clamp-1 text-sm text-gray-500">{feedback.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${statusConfig[feedback.status].color}`}>
                      {statusConfig[feedback.status].icon}
                      {statusConfig[feedback.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(feedback.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {/* Pending: Show "Resolve Immediately" button */}
                      {feedback.status === "pending" && (
                        <Button
                          size="sm"
                          className="gap-1 bg-amber-600 hover:bg-amber-700"
                          onClick={() => handleOpenResolveModal(feedback)}
                        >
                          <MessageSquare className="size-3" />
                          Resolve Immediately
                        </Button>
                      )}

                      {/* In Progress: Show status dropdown */}
                      {feedback.status === "in-progress" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Hourglass className="size-3" />
                              Update Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "resolved")}>
                              <CheckCircle2 className="mr-2 size-4 text-green-600" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "waiting")}>
                              <Clock className="mr-2 size-4 text-gray-600" />
                              Set to Waiting
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {/* Waiting: Show history button */}
                      {feedback.status === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 bg-transparent"
                          onClick={() => handleOpenHistoryModal(feedback)}
                        >
                          <History className="size-3" />
                          Review History
                        </Button>
                      )}

                      {/* Resolved: Show resolved badge and history */}
                      {feedback.status === "resolved" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-green-600 hover:text-green-700"
                          onClick={() => handleOpenHistoryModal(feedback)}
                        >
                          <CheckCircle2 className="size-3" />
                          View Resolution
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resolve Modal */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <MessageSquare className="size-5 text-amber-600" />
              Resolve Feedback
            </DialogTitle>
            <DialogDescription>Respond to the user's feedback and set status to In Progress</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedFeedback.user.name}</CardTitle>
                  <CardDescription>{selectedFeedback.user.email}</CardDescription>
                </CardHeader>
              </Card>

              {/* Feedback Content */}
              <div>
                <label className="text-sm font-medium text-gray-700">User's Feedback</label>
                <div className="mt-1 rounded-lg border bg-white p-3">
                  <p className="font-medium text-gray-900">{selectedFeedback.subject}</p>
                  <p className="mt-1 text-sm text-gray-600">{selectedFeedback.message}</p>
                </div>
              </div>

              {/* Response Input */}
              <div>
                <label htmlFor="response" className="text-sm font-medium text-gray-700">
                  Your Response
                </label>
                <Textarea
                  id="response"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your response to the user..."
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleRespondToUser}
              disabled={!responseContent.trim()}
            >
              <Send className="size-4" />
              Respond to User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <History className="size-5 text-gray-600" />
              Response History
            </DialogTitle>
            <DialogDescription>View all responses sent to this user</DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedFeedback.user.name}</CardTitle>
                  <CardDescription>{selectedFeedback.subject}</CardDescription>
                </CardHeader>
              </Card>

              {/* History Timeline */}
              <ScrollArea className="max-h-64 space-y-3">
                {selectedFeedback.history.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500">No response history available</p>
                ) : (
                  selectedFeedback.history.map((entry, index) => (
                    <div key={entry.id} className="relative rounded-lg border bg-white p-3 pl-6">
                      <div
                        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${
                          entry.status === "resolved"
                            ? "bg-green-500"
                            : entry.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <Badge className={`gap-1 ${statusConfig[entry.status].color}`}>
                          {statusConfig[entry.status].icon}
                          {statusConfig[entry.status].label}
                        </Badge>
                        <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{entry.response}</p>
                      <p className="mt-1 text-xs text-gray-400">Responded by: {entry.respondedBy}</p>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)}>
              Close
            </Button>
            {selectedFeedback?.status === "waiting" && (
              <Button
                className="gap-1"
                onClick={() => {
                  handleStatusChange(selectedFeedback.id, "resolved")
                  setIsHistoryModalOpen(false)
                }}
              >
                <CheckCircle2 className="size-4" />
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
