"use client"

import type React from "react"

import { useState } from "react"
import { HeadphonesIcon, CheckCircle2, AlertCircle, MessageSquare, Send, RefreshCw, Archive, Eye } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type TicketStatus = "open" | "in-progress" | "resolved" | "archived"
type TicketPriority = "low" | "medium" | "high" | "urgent"

interface TicketMessage {
  id: string
  sender: "user" | "admin"
  message: string
  timestamp: Date
}

interface SupportTicket {
  id: string
  user: {
    name: string
    email: string
    avatar: string
  }
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  createdAt: Date
  updatedAt: Date
  messages: TicketMessage[]
}

const initialTickets: SupportTicket[] = [
  {
    id: "TKT001",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Cannot access my account",
    description: "I've been locked out of my account after multiple failed login attempts.",
    status: "open",
    priority: "high",
    category: "Account Recovery",
    createdAt: new Date("2025-01-06T10:00:00"),
    updatedAt: new Date("2025-01-06T10:00:00"),
    messages: [
      {
        id: "M1",
        sender: "user",
        message: "I've tried resetting my password but the email never arrives.",
        timestamp: new Date("2025-01-06T10:00:00"),
      },
    ],
  },
  {
    id: "TKT002",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Billing discrepancy",
    description: "I was charged twice for my subscription this month.",
    status: "in-progress",
    priority: "urgent",
    category: "Billing",
    createdAt: new Date("2025-01-05T14:30:00"),
    updatedAt: new Date("2025-01-06T09:00:00"),
    messages: [
      {
        id: "M2",
        sender: "user",
        message: "Please refund the duplicate charge as soon as possible.",
        timestamp: new Date("2025-01-05T14:30:00"),
      },
      {
        id: "M3",
        sender: "admin",
        message: "We're investigating this issue. Can you provide the transaction IDs?",
        timestamp: new Date("2025-01-06T09:00:00"),
      },
    ],
  },
  {
    id: "TKT003",
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Feature suggestion",
    description: "Would love to see a mobile app version.",
    status: "resolved",
    priority: "low",
    category: "Feature Request",
    createdAt: new Date("2025-01-03T08:00:00"),
    updatedAt: new Date("2025-01-04T16:00:00"),
    messages: [
      {
        id: "M4",
        sender: "user",
        message: "Is there a timeline for the mobile app?",
        timestamp: new Date("2025-01-03T08:00:00"),
      },
      {
        id: "M5",
        sender: "admin",
        message: "Great suggestion! We're planning to release a mobile app in Q3 2025.",
        timestamp: new Date("2025-01-04T16:00:00"),
      },
    ],
  },
  {
    id: "TKT004",
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Data export issue",
    description: "The CSV export feature is not working properly.",
    status: "archived",
    priority: "medium",
    category: "Technical Issue",
    createdAt: new Date("2024-12-20T11:00:00"),
    updatedAt: new Date("2024-12-22T14:00:00"),
    messages: [
      {
        id: "M6",
        sender: "user",
        message: "The export button shows an error.",
        timestamp: new Date("2024-12-20T11:00:00"),
      },
      {
        id: "M7",
        sender: "admin",
        message: "This has been fixed in our latest update. Please try again.",
        timestamp: new Date("2024-12-22T14:00:00"),
      },
    ],
  },
]

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: {
    label: "Open",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <AlertCircle className="size-3" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <RefreshCw className="size-3" />,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="size-3" />,
  },
  archived: {
    label: "Archived",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <Archive className="size-3" />,
  },
}

const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const { toast } = useToast()

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter)

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsViewModalOpen(true)
  }

  const handleOpenReplyModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setReplyContent("")
    setIsReplyModalOpen(true)
  }

  const handleSendReply = () => {
    if (!selectedTicket || !replyContent.trim()) return

    const newMessage: TicketMessage = {
      id: `M${Date.now()}`,
      sender: "admin",
      message: replyContent,
      timestamp: new Date(),
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "in-progress" as TicketStatus,
              updatedAt: new Date(),
              messages: [...t.messages, newMessage],
            }
          : t,
      ),
    )

    toast({
      title: "Reply Sent",
      description: `Your reply has been sent to ${selectedTicket.user.name}`,
    })
    setIsReplyModalOpen(false)
    setReplyContent("")
  }

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t)))
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${statusConfig[newStatus].label}`,
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
          <h2 className="font-serif text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-sm text-gray-500">Manage and respond to user support requests</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Filter: {statusFilter === "all" ? "All Status" : statusConfig[statusFilter]?.label || statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => setStatusFilter(key as TicketStatus)}>
                <span className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Open Tickets</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {tickets.filter((t) => t.status === "open").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {tickets.filter((t) => t.status === "in-progress").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {tickets.filter((t) => t.status === "resolved").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Urgent</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {tickets.filter((t) => t.priority === "urgent").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={ticket.user.avatar || "/placeholder.svg"} alt={ticket.user.name} />
                        <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{ticket.user.name}</p>
                        <p className="text-sm text-gray-500">{ticket.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">{ticket.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityConfig[ticket.priority].color}>
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${statusConfig[ticket.status].color}`}>
                      {statusConfig[ticket.status].icon}
                      {statusConfig[ticket.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(ticket.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewTicket(ticket)}>
                        <Eye className="size-4" />
                      </Button>
                      {ticket.status !== "archived" && (
                        <>
                          <Button
                            size="sm"
                            className="gap-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleOpenReplyModal(ticket)}
                          >
                            <MessageSquare className="size-3" />
                            Reply
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                Status
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "resolved")}>
                                <CheckCircle2 className="mr-2 size-4 text-green-600" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "archived")}>
                                <Archive className="mr-2 size-4 text-gray-600" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Ticket Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <HeadphonesIcon className="size-5 text-blue-600" />
              Ticket Details
            </DialogTitle>
            <DialogDescription>View ticket information and conversation history</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Avatar className="size-10">
                  <AvatarImage src={selectedTicket.user.avatar || "/placeholder.svg"} alt={selectedTicket.user.name} />
                  <AvatarFallback>{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{selectedTicket.user.name}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityConfig[selectedTicket.priority].color}>
                    {priorityConfig[selectedTicket.priority].label}
                  </Badge>
                  <Badge className={`gap-1 ${statusConfig[selectedTicket.status].color}`}>
                    {statusConfig[selectedTicket.status].icon}
                    {statusConfig[selectedTicket.status].label}
                  </Badge>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="rounded-lg border p-3">
                <p className="font-medium text-gray-900">{selectedTicket.subject}</p>
                <p className="mt-1 text-sm text-gray-600">{selectedTicket.description}</p>
                <p className="mt-2 text-xs text-gray-400">Category: {selectedTicket.category}</p>
              </div>

              {/* Messages */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Conversation</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-3 ${msg.sender === "admin" ? "ml-4 bg-blue-50" : "mr-4 bg-gray-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">
                            {msg.sender === "admin" ? "Admin" : selectedTicket.user.name}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(msg.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <MessageSquare className="size-5 text-blue-600" />
              Reply to Ticket
            </DialogTitle>
            <DialogDescription>Send a response to {selectedTicket?.user.name}</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Avatar className="size-10">
                  <AvatarImage src={selectedTicket.user.avatar || "/placeholder.svg"} alt={selectedTicket.user.name} />
                  <AvatarFallback>{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedTicket.user.name}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
                </div>
              </div>

              {/* Reply Input */}
              <div>
                <label className="text-sm font-medium text-gray-700">Your Reply</label>
                <Textarea
                  rows={4}
                  className="mt-1 w-full"
                  placeholder="Type your response..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSendReply}
              disabled={!replyContent.trim()}
            >
              <Send className="size-4" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
