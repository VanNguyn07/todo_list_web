import React, { useState, useRef, useEffect } from "react"
// Cần cài đặt: npm install lucide-react
import { HeadphonesIcon, CheckCircle2, AlertCircle, MessageSquare, Send, RefreshCw, Archive, Eye, MoreVertical, Filter } from "lucide-react"

// --- Dữ liệu giả lập ---
const initialTickets = [
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

const statusConfig = {
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

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
}

// --- Helper Components ---

const Button = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  }
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9",
  }
  return (
    <button className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ""}`} {...props}>
      {children}
    </button>
  )
}

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
)

const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-white text-gray-950 shadow-sm ${className || ""}`}>
    {children}
  </div>
)

const Avatar = ({ src, fallback, alt }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 items-center justify-center">
      {!imgError && src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className="text-sm font-medium text-gray-600">{fallback}</span>
      )}
    </div>
  )
}

const Modal = ({ isOpen, title, description, children, footer }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="mb-4 shrink-0">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">{title}</h3>
          {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex-1 overflow-y-auto pr-2">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}

const SimpleDropdown = ({ trigger, items, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 w-48 rounded-md border bg-white p-1 shadow-md animate-in fade-in zoom-in-95 duration-100 ${align === "right" ? "right-0" : "left-0"}`}>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


export default function SupportTickets() {
  const [tickets, setTickets] = useState(initialTickets)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Hàm giả lập Toast notification
  const showToast = ({ title, description }) => {
    alert(`${title}: ${description}`)
  }

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter)

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsViewModalOpen(true)
  }

  const handleOpenReplyModal = (ticket) => {
    setSelectedTicket(ticket)
    setReplyContent("")
    setIsReplyModalOpen(true)
  }

  const handleSendReply = () => {
    if (!selectedTicket || !replyContent.trim()) return

    const newMessage = {
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
              status: "in-progress",
              updatedAt: new Date(),
              messages: [...t.messages, newMessage],
            }
          : t,
      ),
    )

    showToast({
      title: "Reply Sent",
      description: `Your reply has been sent to ${selectedTicket.user.name}`,
    })
    setIsReplyModalOpen(false)
    setReplyContent("")
  }

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t)))
    showToast({
      title: "Status Updated",
      description: `Ticket status changed to ${statusConfig[newStatus].label}`,
    })
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-sm text-gray-500">Manage and respond to user support requests</p>
        </div>

        <SimpleDropdown 
          trigger={
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filter: {statusFilter === "all" ? "All Status" : statusConfig[statusFilter]?.label || statusFilter}
            </Button>
          }
          items={[
            { label: "All Status", onClick: () => setStatusFilter("all") },
            ...Object.entries(statusConfig).map(([key, config]) => ({
              label: (
                <span className="flex items-center gap-2">
                  {config.icon}
                  {config.label}
                </span>
              ),
              onClick: () => setStatusFilter(key),
            }))
          ]}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6 border shadow-sm">
            <p className="text-sm text-gray-500">Open Tickets</p>
            <h3 className="text-2xl font-bold text-amber-600">
              {tickets.filter((t) => t.status === "open").length}
            </h3>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {tickets.filter((t) => t.status === "in-progress").length}
            </h3>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-sm text-gray-500">Resolved</p>
            <h3 className="text-2xl font-bold text-green-600">
              {tickets.filter((t) => t.status === "resolved").length}
            </h3>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-sm text-gray-500">Urgent</p>
            <h3 className="text-2xl font-bold text-red-600">
              {tickets.filter((t) => t.priority === "urgent").length}
            </h3>
        </Card>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b bg-gray-50 transition-colors hover:bg-gray-50/50">
                <th className="h-12 px-4 align-middle font-medium text-gray-500">User</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Subject</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Priority</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Last Updated</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center h-32 text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b transition-colors hover:bg-gray-50/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar src={ticket.user.avatar} fallback={ticket.user.name.charAt(0)} alt={ticket.user.name} />
                        <div>
                          <p className="font-medium text-gray-900">{ticket.user.name}</p>
                          <p className="text-sm text-gray-500">{ticket.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <p className="font-medium text-gray-900">{ticket.subject}</p>
                        <p className="text-xs text-gray-500">{ticket.category}</p>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={priorityConfig[ticket.priority].color}>
                        {priorityConfig[ticket.priority].label}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={`gap-1 ${statusConfig[ticket.status].color}`}>
                        {statusConfig[ticket.status].icon}
                        {statusConfig[ticket.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-sm text-gray-500">{formatDate(ticket.updatedAt)}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewTicket(ticket)}>
                          <Eye className="size-4" />
                        </Button>
                        {ticket.status !== "archived" && (
                          <>
                            <Button
                              size="sm"
                              className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleOpenReplyModal(ticket)}
                            >
                              <MessageSquare className="size-3" />
                              Reply
                            </Button>
                            
                            <SimpleDropdown 
                                trigger={
                                    <Button size="sm" variant="outline">
                                        Status
                                    </Button>
                                }
                                align="right"
                                items={[
                                    {
                                        label: <><CheckCircle2 className="mr-2 size-4 text-green-600" />Mark Resolved</>,
                                        onClick: () => handleStatusChange(ticket.id, "resolved")
                                    },
                                    {
                                        label: <><Archive className="mr-2 size-4 text-gray-600" />Archive</>,
                                        onClick: () => handleStatusChange(ticket.id, "archived")
                                    }
                                ]}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Ticket Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={
            <div className="flex items-center gap-2 font-serif">
               <HeadphonesIcon className="size-5 text-blue-600" /> Ticket Details
            </div>
        }
        description="View ticket information and conversation history"
        footer={
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
        }
      >
          {selectedTicket && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border">
                <Avatar src={selectedTicket.user.avatar} fallback={selectedTicket.user.name.charAt(0)} alt={selectedTicket.user.name} />
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
                <div className="h-48 overflow-y-auto space-y-3 pr-2">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-3 ${msg.sender === "admin" ? "ml-4 bg-blue-50 border border-blue-100" : "mr-4 bg-gray-50 border border-gray-100"}`}
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
              </div>
            </div>
          )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title={
            <div className="flex items-center gap-2 font-serif">
                <MessageSquare className="size-5 text-blue-600" /> Reply to Ticket
            </div>
        }
        description={`Send a response to ${selectedTicket?.user.name}`}
        footer={
            <div className="flex gap-2 w-full justify-end">
                <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
                Cancel
                </Button>
                <Button
                className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSendReply}
                disabled={!replyContent.trim()}
                >
                <Send className="size-4" />
                Send Reply
                </Button>
            </div>
        }
      >
          {selectedTicket && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border">
                 <Avatar src={selectedTicket.user.avatar} fallback={selectedTicket.user.name.charAt(0)} alt={selectedTicket.user.name} />
                <div>
                  <p className="font-medium">{selectedTicket.user.name}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
                </div>
              </div>

              {/* Reply Input */}
              <div>
                <label className="text-sm font-medium text-gray-700">Your Reply</label>
                <textarea
                  rows={4}
                  className="mt-1 flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  placeholder="Type your response..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
              </div>
            </div>
          )}
      </Modal>
    </div>
  )
}