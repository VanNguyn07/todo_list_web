"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Bell, CalendarIcon, Send, Users, User, Mail, History, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type NotificationHistory = {
  id: string
  title: string
  message: string
  targetGroup: string
  targetEmail?: string
  sentAt: string
  scheduledDate?: Date
  status: "sent" | "scheduled"
}

const initialHistory: NotificationHistory[] = [
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

interface NotificationsProps {
  onNotificationSent?: () => void
}

export default function Notifications({ onNotificationSent }: NotificationsProps) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [targetGroup, setTargetGroup] = useState("all")
  const [targetEmail, setTargetEmail] = useState("")
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTime, setScheduleTime] = useState("")
  const [history, setHistory] = useState<NotificationHistory[]>(initialHistory)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const { toast } = useToast()

  const [errors, setErrors] = useState<{
    title?: string
    message?: string
    email?: string
  }>({})

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { title?: string; message?: string; email?: string } = {}

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
      toast({
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

    const newNotification: NotificationHistory = {
      id: Date.now().toString(),
      title,
      message,
      targetGroup,
      targetEmail: targetGroup === "specific" ? targetEmail : undefined,
      sentAt: isScheduled ? scheduledDateTime! : format(new Date(), "yyyy-MM-dd HH:mm"),
      scheduledDate: scheduleDate,
      status: isScheduled ? "scheduled" : "sent",
    }

    setHistory([newNotification, ...history])

    onNotificationSent?.()

    toast({
      title: isScheduled ? "Notification Scheduled" : "Notification Sent Successfully",
      description: `"${title}" has been ${isScheduled ? "scheduled for " + format(scheduleDate!, "PPP") : "sent"} to ${
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

  const getTargetLabel = (group: string, email?: string) => {
    switch (group) {
      case "all":
        return "All Users"
      case "admins":
        return "Admins Only"
      case "moderators":
        return "Moderators"
      case "users":
        return "Regular Users"
      case "specific":
        return email || "Specific User"
      default:
        return group
    }
  }

  const sentCount = history.filter((h) => h.status === "sent").length
  const scheduledCount = history.filter((h) => h.status === "scheduled").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">Create and send system notifications to users</p>
        </div>
        <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <History className="size-4" />
              View History
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                {history.length}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif">
                <History className="size-5 text-blue-600" />
                Notification History
              </DialogTitle>
              <DialogDescription>Review all sent and scheduled notifications</DialogDescription>
            </DialogHeader>
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
                            variant={item.status === "sent" ? "default" : "secondary"}
                            className={cn(
                              "text-xs",
                              item.status === "sent"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-100",
                            )}
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
          </DialogContent>
        </Dialog>
      </div>

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
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Bell className="size-5 text-blue-600" />
            Create Notification
          </CardTitle>
          <CardDescription>Send a notification to your users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              className={cn("mt-1", errors.title && "border-red-500 focus-visible:ring-red-500")}
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
              className={cn("mt-1", errors.message && "border-red-500 focus-visible:ring-red-500")}
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
              <Select
                value={targetGroup}
                onValueChange={(value) => {
                  setTargetGroup(value)
                  if (value !== "specific") {
                    setTargetEmail("")
                    setErrors({ ...errors, email: undefined })
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Users className="size-4" />
                      All Users
                    </span>
                  </SelectItem>
                  <SelectItem value="admins">
                    <span className="flex items-center gap-2">
                      <User className="size-4" />
                      Admins Only
                    </span>
                  </SelectItem>
                  <SelectItem value="moderators">
                    <span className="flex items-center gap-2">
                      <User className="size-4" />
                      Moderators
                    </span>
                  </SelectItem>
                  <SelectItem value="users">
                    <span className="flex items-center gap-2">
                      <User className="size-4" />
                      Regular Users
                    </span>
                  </SelectItem>
                  <SelectItem value="specific">
                    <span className="flex items-center gap-2">
                      <Mail className="size-4" />
                      Specific User
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Schedule (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !scheduleDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    disabled={(date) => date < new Date()}
                  />
                  {scheduleDate && (
                    <div className="border-t p-3">
                      <label className="text-xs font-medium text-gray-600">Time</label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="mt-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setScheduleDate(undefined)
                          setScheduleTime("")
                        }}
                      >
                        Clear Schedule
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
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
                  className={cn("pl-10", errors.email && "border-red-500 focus-visible:ring-red-500")}
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
        </CardContent>
      </Card>
    </div>
  )
}
