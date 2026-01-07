import React, { useState } from "react"
// Đảm bảo bạn đã cài: npm install date-fns
import { format } from "date-fns"
import { Bell, CalendarIcon, Send, Users, User, Mail, History, Clock, CheckCircle2, AlertCircle, X, ChevronDown } from "lucide-react"

// --- Dữ liệu giả lập ---
const initialHistory = [
  {
    id: "1",
    title: "System Maintenance",
    message: "Scheduled maintenance on Dec 10th from 2-4 AM UTC.",
    targetGroup: "all",
    sentAt: "2024-12-05 10:30",
    status: "sent",
  },
  {
    id: "2",
    title: "New Feature Release",
    message: "Check out our new dashboard features!",
    targetGroup: "users",
    sentAt: "2024-12-04 14:00",
    status: "sent",
  },
  {
    id: "3",
    title: "Account Verification Required",
    message: "Please verify your account to continue using premium features.",
    targetGroup: "specific",
    targetEmail: "john@example.com",
    sentAt: "2024-12-03 09:15",
    status: "sent",
  },
]

// --- Helper Components (Thay thế UI Library) ---

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

const Input = ({ className, ...props }) => (
  <input
    className={`flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
)

const Textarea = ({ className, ...props }) => (
  <textarea
    className={`flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
)

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "text-gray-950 border-gray-200",
  }
  
  // Custom logic xử lý class màu động từ code cũ
  let finalClass = variants[variant] || variants.default;
  if (className && className.includes("bg-green-100")) finalClass = "bg-green-100 text-green-700 border-transparent";
  if (className && className.includes("bg-amber-100")) finalClass = "bg-amber-100 text-amber-700 border-transparent";
  if (className && className.includes("bg-blue-100")) finalClass = "bg-blue-100 text-blue-700 border-transparent";

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${finalClass} ${className || ""}`}>
      {children}
    </div>
  )
}

const Modal = ({ isOpen, onClose, title, description, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-white shadow-lg animate-in zoom-in-95 duration-200">
        <div className="p-6 pb-2">
          <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">{title}</h3>
          {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 overflow-y-auto p-6 pt-2">{children}</div>
      </div>
    </div>
  )
}

// --- Main Component ---

export default function Notifications({ onNotificationSent }) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [targetGroup, setTargetGroup] = useState("all")
  const [targetEmail, setTargetEmail] = useState("")
  const [scheduleDate, setScheduleDate] = useState(undefined)
  const [scheduleTime, setScheduleTime] = useState("")
  const [history, setHistory] = useState(initialHistory)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  
  const [errors, setErrors] = useState({})

  // Hàm thay thế useToast
  const showToast = ({ title, description, variant }) => {
    alert(`${variant === "destructive" ? "Error" : "Success"}: ${title}\n${description}`)
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!message.trim()) {
      newErrors.message = "Message is required"
    }

    if (targetGroup === "specific") {
      if (!targetEmail.trim()) {
        newErrors.email = "Email is required for specific user"
      } else if (!isValidEmail(targetEmail)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendNotification = () => {
    if (!validateForm()) {
      showToast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      })
      return
    }

    const isScheduled = scheduleDate !== undefined
    const scheduledDateTime = scheduleDate
      ? `${format(scheduleDate, "yyyy-MM-dd")} ${scheduleTime || "00:00"}`
      : undefined

    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      targetGroup,
      targetEmail: targetGroup === "specific" ? targetEmail : undefined,
      sentAt: isScheduled ? scheduledDateTime : format(new Date(), "yyyy-MM-dd HH:mm"),
      scheduledDate: scheduleDate,
      status: isScheduled ? "scheduled" : "sent",
    }

    setHistory([newNotification, ...history])

    if (onNotificationSent) onNotificationSent()

    showToast({
      title: isScheduled ? "Notification Scheduled" : "Notification Sent Successfully",
      description: `"${title}" has been ${isScheduled ? "scheduled for " + format(scheduleDate, "PPP") : "sent"} to ${
        targetGroup === "all" ? "all users" : targetGroup === "specific" ? targetEmail : targetGroup
      }`,
    })

    // Reset form
    setTitle("")
    setMessage("")
    setTargetGroup("all")
    setTargetEmail("")
    setScheduleDate(undefined)
    setScheduleTime("")
    setErrors({})
  }

  const getTargetLabel = (group, email) => {
    switch (group) {
      case "all": return "All Users"
      case "admins": return "Admins Only"
      case "moderators": return "Moderators"
      case "users": return "Regular Users"
      case "specific": return email || "Specific User"
      default: return group
    }
  }

  const sentCount = history.filter((h) => h.status === "sent").length
  const scheduledCount = history.filter((h) => h.status === "scheduled").length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
          <p className="text-1xl text-gray-500">Create and send system notifications to users</p>
        </div>
        
        {/* <Button variant="outline" className="gap-2" onClick={() => setHistoryModalOpen(true)}>
          <History className="size-4" />
          View History
          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
            {history.length}
          </Badge>
        </Button> */}
      </div>

      {/* History Modal */}
      <Modal 
        isOpen={historyModalOpen} 
        onClose={() => setHistoryModalOpen(false)}
        title={
          <>
            <History className="size-5 text-blue-600" />
            Notification History
          </>
        }
        description="Review all sent and scheduled notifications"
      >
        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{sentCount} Sent</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
            <Clock className="size-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">{scheduledCount} Scheduled</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="mb-2 size-10 text-gray-300" />
              <p>No notifications sent yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <Badge
                        className={
                          item.status === "sent"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-transparent"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent"
                        }
                      >
                        {item.status === "sent" ? (
                          <CheckCircle2 className="mr-1 size-3" />
                        ) : (
                          <Clock className="mr-1 size-3" />
                        )}
                        {item.status === "sent" ? "Sent" : "Scheduled"}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-600">{item.message}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
                        <Users className="size-3" />
                        {getTargetLabel(item.targetGroup, item.targetEmail)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.sentAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Summary Stats */}
      {history.filter((h) => h.status === "sent").length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              {sentCount} notification{sentCount !== 1 ? "s" : ""} sent successfully
            </p>
            <p className="text-xs text-green-600">Last sent: {history.find((h) => h.status === "sent")?.sentAt}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistoryModalOpen(true)}
            className="text-green-700 hover:bg-green-100 hover:text-green-800"
          >
            View Details
          </Button>
        </div>
      )}

      {/* Create Notification Form */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <Bell className="size-5 text-blue-600" />
            Create Notification
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">Send a notification to your users</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: undefined })
              }}
              placeholder="Enter notification title"
              className={`mt-1 ${errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.title && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (errors.message) setErrors({ ...errors, message: undefined })
              }}
              placeholder="Enter notification message"
              className={`mt-1 ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.message && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" />
                {errors.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Target Group</label>
              <div className="relative mt-1">
                <select
                  value={targetGroup}
                  onChange={(e) => {
                    const value = e.target.value
                    setTargetGroup(value)
                    if (value !== "specific") {
                      setTargetEmail("")
                      setErrors({ ...errors, email: undefined })
                    }
                  }}
                  className="flex h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-1 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="admins">Admins Only</option>
                  <option value="moderators">Moderators</option>
                  <option value="users">Regular Users</option>
                  <option value="specific">Specific User</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Schedule (Optional)</label>
              <div className="mt-1 flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    type="date" 
                    value={scheduleDate ? format(scheduleDate, "yyyy-MM-dd") : ""}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => {
                      const dateVal = e.target.value ? new Date(e.target.value) : undefined
                      setScheduleDate(dateVal)
                    }}
                    className="w-full"
                  />
                </div>
                {scheduleDate && (
                  <div className="w-1/3">
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
              {scheduleDate && (
                 <button 
                  onClick={() => {
                    setScheduleDate(undefined)
                    setScheduleTime("")
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-700 hover:underline"
                 >
                   Clear schedule
                 </button>
              )}
            </div>
          </div>

          {targetGroup === "specific" && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              <label className="text-sm font-medium text-gray-700">
                User Email <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => {
                    setTargetEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="Enter user email address"
                  className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="size-3" />
                  {errors.email}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">The notification will be sent only to this specific user</p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setTitle("")
                setMessage("")
                setTargetGroup("all")
                setTargetEmail("")
                setScheduleDate(undefined)
                setScheduleTime("")
                setErrors({})
              }}
            >
              Clear Form
            </Button>
            <Button onClick={handleSendNotification} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="size-4" />
              {scheduleDate ? "Schedule Notification" : "Send Notification"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}