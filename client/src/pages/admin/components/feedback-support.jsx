import React, { useState, useMemo, useRef, useEffect } from "react"
import { CheckCircle2, Clock, AlertCircle, Hourglass, MessageSquare, User, Mail, History, Send, X, MoreVertical, Filter } from "lucide-react"
// --- Dữ liệu giả lập ---
const initialFeedback = [
  {
    id: "FB001",
    user: { name: "Van Nguyen", email: "vannguyen@gmail.com" },
    subject: "Unable to login",
    message: "I'm having trouble logging into my account. The password reset isn't working.",
    status: "pending",
    createdAt: new Date("2025-01-05T10:30:00"),
    updatedAt: new Date("2025-01-05T10:30:00"),
    history: [],
  },
  {
    id: "FB002",
    user: { name: "Lan Anh", email: "lananh@gmail.com" },
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
    user: { name: "Thanh Trung", email: "thanhtrung@gmail.com" },
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
    user: { name: "Shiron", email: "shiron@gmail.com" },
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
    user: { name: "Sofia", email: "sofia@gmail.com" },
    subject: "Bug report",
    message: "The search function is not returning correct results.",
    status: "pending",
    createdAt: new Date("2025-01-06T15:30:00"),
    updatedAt: new Date("2025-01-06T15:30:00"),
    history: [],
  },
]

const statusConfig = {
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

// --- Helper Components (Thay thế cho UI Library bị thiếu) ---

// 1. Badge Component
const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
)

// 2. Button Component
const Button = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
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

// 3. Modal/Dialog Component thuần
const Modal = ({ isOpen, onClose, title, description, children, footer }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
          {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
        <div className="py-2">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

// 4. Dropdown Menu đơn giản
const SimpleDropdown = ({ trigger, items }) => {
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
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border bg-white p-1 shadow-md animate-in fade-in zoom-in-95 duration-100">
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


export default function FeedbackSupport() {
  const [feedbackList, setFeedbackList] = useState(initialFeedback)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [responseContent, setResponseContent] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock Toast function (vì file hook có thể chưa tồn tại)
  const showToast = ({ title, description }) => {
    // Bạn có thể thay bằng alert hoặc console.log
    alert(`${title}: ${description}`)
  }

  const filteredFeedback = useMemo(() => {
    if (statusFilter === "all") return feedbackList
    return feedbackList.filter((fb) => fb.status === statusFilter)
  }, [feedbackList, statusFilter])

  const handleOpenResolveModal = (feedback) => {
    setSelectedFeedback(feedback)
    setResponseContent("")
    setIsResolveModalOpen(true)
  }

  const handleOpenHistoryModal = (feedback) => {
    setSelectedFeedback(feedback)
    setIsHistoryModalOpen(true)
  }

  const handleRespondToUser = () => {
    if (!selectedFeedback || !responseContent.trim()) {
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a response message",
      })
      return
    }

    const newHistoryEntry = {
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
              status: "in-progress",
              updatedAt: new Date(),
              history: [...fb.history, newHistoryEntry],
            }
          : fb,
      ),
    )

    showToast({
      title: "Success",
      description: `Response sent to ${selectedFeedback.user.name}. Status set to In Progress.`,
    })
    setIsResolveModalOpen(false)
    setResponseContent("")
    setSelectedFeedback(null)
  }

  const handleStatusChange = (feedbackId, newStatus) => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === feedbackId ? { ...fb, status: newStatus, updatedAt: new Date() } : fb)),
    )
    showToast({
      title: "Success",
      description: `Feedback status updated to ${statusConfig[newStatus].label}`,
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Feedback Management</h2>
          <p className="text-1xl text-gray-500">Manage user feedback</p>
        </div>

        {/* Status Filter */}
        <SimpleDropdown 
          trigger={
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter: {statusFilter === "all" ? "All Status" : statusConfig[statusFilter]?.label || statusFilter}
            </Button>
          }
          items={[
            { label: "All Status", onClick: () => setStatusFilter("all") },
            ...Object.entries(statusConfig).map(([key, config]) => ({
              label: (
                <span className="flex items-center gap-2">
                  {config.icon} {config.label}
                </span>
              ),
              onClick: () => setStatusFilter(key),
            }))
          ]}
        />
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4 border">
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
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors bg-gray-50/50 hover:bg-gray-50/50">
                <th className="h-12 px-4 align-middle font-medium text-gray-500">User Info</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Subject</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Last Updated</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center h-32 text-gray-500">
                    No feedback found matching the criteria
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((feedback) => (
                  <tr key={feedback.id} className="border-b transition-colors hover:bg-gray-50/50">
                    <td className="p-4 align-middle">
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
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <p className="font-medium text-gray-900">{feedback.subject}</p>
                        <p className="line-clamp-1 text-sm text-gray-500">{feedback.message}</p>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={`gap-1 ${statusConfig[feedback.status].color}`}>
                        {statusConfig[feedback.status].icon}
                        {statusConfig[feedback.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-gray-500">{formatDate(feedback.updatedAt)}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {feedback.status === "pending" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => handleOpenResolveModal(feedback)}
                          >
                            <MessageSquare className="size-3" />
                            Resolve
                          </Button>
                        )}

                        {feedback.status === "in-progress" && (
                          <SimpleDropdown 
                            trigger={
                              <Button size="sm" variant="outline" className="gap-1">
                                <Hourglass className="size-3" /> Update
                              </Button>
                            }
                            items={[
                              { 
                                label: <><CheckCircle2 className="mr-2 size-4 text-green-600" />Mark Resolved</>, 
                                onClick: () => handleStatusChange(feedback.id, "resolved") 
                              },
                              { 
                                label: <><Clock className="mr-2 size-4 text-gray-600" />Set Waiting</>, 
                                onClick: () => handleStatusChange(feedback.id, "waiting") 
                              }
                            ]}
                          />
                        )}

                        {feedback.status === "waiting" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenHistoryModal(feedback)}
                          >
                            <History className="size-3" />
                            Review
                          </Button>
                        )}

                        {feedback.status === "resolved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-green-600 hover:text-green-700"
                            onClick={() => handleOpenHistoryModal(feedback)}
                          >
                            <CheckCircle2 className="size-3" />
                            Resolved
                          </Button>
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

      {/* Resolve Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
             <MessageSquare className="size-5 text-amber-600" /> Resolve Feedback
          </div>
        }
        description="Respond to the user's feedback and set status to In Progress"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsResolveModalOpen(false)}>Cancel</Button>
            <Button className="gap-1" onClick={handleRespondToUser} disabled={!responseContent.trim()}>
              <Send className="size-4" /> Respond
            </Button>
          </>
        }
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-semibold leading-none tracking-tight">{selectedFeedback.user.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedFeedback.user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">User's Feedback</label>
              <div className="mt-1 rounded-lg border bg-white p-3">
                <p className="font-medium text-gray-900">{selectedFeedback.subject}</p>
                <p className="mt-1 text-sm text-gray-600">{selectedFeedback.message}</p>
              </div>
            </div>

            <div>
              <label htmlFor="response" className="text-sm font-medium text-gray-700">Your Response</label>
              <textarea
                id="response"
                rows={4}
                className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Enter your response..."
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
             <History className="size-5 text-gray-600" /> Response History
          </div>
        }
        description="View all responses sent to this user"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
            {selectedFeedback?.status === "waiting" && (
              <Button className="gap-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                handleStatusChange(selectedFeedback.id, "resolved")
                setIsHistoryModalOpen(false)
              }}>
                <CheckCircle2 className="size-4" /> Mark as Resolved
              </Button>
            )}
          </>
        }
      >
        {selectedFeedback && (
          <div className="space-y-4">
             <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="font-semibold leading-none tracking-tight">{selectedFeedback.user.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedFeedback.subject}</p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {selectedFeedback.history.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No response history available</p>
              ) : (
                selectedFeedback.history.map((entry) => (
                  <div key={entry.id} className="relative rounded-lg border bg-white p-3 pl-6">
                    <div
                      className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${
                        entry.status === "resolved" ? "bg-green-500" : entry.status === "in-progress" ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <Badge className={`gap-1 ${statusConfig[entry.status].color}`}>
                        {statusConfig[entry.status].icon} {statusConfig[entry.status].label}
                      </Badge>
                      <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{entry.response}</p>
                    <p className="mt-1 text-xs text-gray-400">Responded by: {entry.respondedBy}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}