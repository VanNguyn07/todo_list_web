"use client"

import type React from "react"

import { useState } from "react"
import { Bug, CheckCircle2, Clock, Eye, RefreshCw, Server, XCircle } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ErrorStatus = "open" | "investigating" | "fixed" | "wont-fix"
type ErrorSeverity = "low" | "medium" | "high" | "critical"

interface ErrorLog {
  id: string
  errorCode: string
  message: string
  description: string
  severity: ErrorSeverity
  status: ErrorStatus
  source: string
  stackTrace: string
  occurrences: number
  firstOccurred: Date
  lastOccurred: Date
  resolvedAt?: Date
  resolution?: string
}

const initialErrors: ErrorLog[] = [
  {
    id: "ERR001",
    errorCode: "AUTH_FAILED",
    message: "Authentication service timeout",
    description: "Users unable to login due to authentication service not responding within timeout period.",
    severity: "critical",
    status: "investigating",
    source: "auth-service",
    stackTrace:
      "Error: Connection timeout at AuthService.authenticate()\n  at UserController.login()\n  at Router.handle()",
    occurrences: 45,
    firstOccurred: new Date("2025-01-06T08:00:00"),
    lastOccurred: new Date("2025-01-06T14:30:00"),
  },
  {
    id: "ERR002",
    errorCode: "DB_CONN_FAILED",
    message: "Database connection pool exhausted",
    description: "Maximum connections reached, new requests are being rejected.",
    severity: "high",
    status: "open",
    source: "database",
    stackTrace: "Error: Connection pool exhausted\n  at Pool.getConnection()\n  at QueryBuilder.execute()",
    occurrences: 23,
    firstOccurred: new Date("2025-01-06T10:00:00"),
    lastOccurred: new Date("2025-01-06T13:45:00"),
  },
  {
    id: "ERR003",
    errorCode: "API_RATE_LIMIT",
    message: "External API rate limit exceeded",
    description: "Third-party payment API rate limit has been exceeded.",
    severity: "medium",
    status: "fixed",
    source: "payment-service",
    stackTrace: "Error: Rate limit exceeded\n  at PaymentGateway.processPayment()\n  at CheckoutController.complete()",
    occurrences: 12,
    firstOccurred: new Date("2025-01-05T15:00:00"),
    lastOccurred: new Date("2025-01-05T16:30:00"),
    resolvedAt: new Date("2025-01-05T17:00:00"),
    resolution: "Implemented request queuing and retry mechanism with exponential backoff.",
  },
  {
    id: "ERR004",
    errorCode: "CACHE_MISS",
    message: "Redis cache connection failed",
    description: "Cache server not responding, falling back to database queries.",
    severity: "low",
    status: "wont-fix",
    source: "cache-service",
    stackTrace: "Error: ECONNREFUSED\n  at CacheClient.get()\n  at DataService.fetch()",
    occurrences: 8,
    firstOccurred: new Date("2025-01-04T09:00:00"),
    lastOccurred: new Date("2025-01-04T09:15:00"),
    resolvedAt: new Date("2025-01-04T10:00:00"),
    resolution: "Issue was transient and self-resolved. Monitoring in place.",
  },
  {
    id: "ERR005",
    errorCode: "FILE_UPLOAD_FAILED",
    message: "File upload size exceeded",
    description: "Users attempting to upload files larger than 10MB limit.",
    severity: "low",
    status: "open",
    source: "upload-service",
    stackTrace: "Error: File size exceeds limit\n  at UploadHandler.validate()\n  at FileController.upload()",
    occurrences: 156,
    firstOccurred: new Date("2025-01-01T00:00:00"),
    lastOccurred: new Date("2025-01-06T12:00:00"),
  },
]

const statusConfig: Record<ErrorStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: {
    label: "Open",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <XCircle className="size-3" />,
  },
  investigating: {
    label: "Investigating",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <RefreshCw className="size-3" />,
  },
  fixed: {
    label: "Fixed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="size-3" />,
  },
  "wont-fix": {
    label: "Won't Fix",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <Clock className="size-3" />,
  },
}

const severityConfig: Record<ErrorSeverity, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700" },
}

export default function SystemErrors() {
  const [errors, setErrors] = useState<ErrorLog[]>(initialErrors)
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState<ErrorStatus | "all">("all")
  const { toast } = useToast()

  const filteredErrors = statusFilter === "all" ? errors : errors.filter((e) => e.status === statusFilter)

  const handleViewDetails = (error: ErrorLog) => {
    setSelectedError(error)
    setIsDetailModalOpen(true)
  }

  const handleOpenResolveModal = (error: ErrorLog) => {
    setSelectedError(error)
    setResolutionNotes("")
    setIsResolveModalOpen(true)
  }

  const handleResolveError = (status: "fixed" | "wont-fix") => {
    if (!selectedError) return

    setErrors((prev) =>
      prev.map((e) =>
        e.id === selectedError.id
          ? {
              ...e,
              status,
              resolvedAt: new Date(),
              resolution: resolutionNotes || `Marked as ${statusConfig[status].label}`,
            }
          : e,
      ),
    )

    toast({
      title: "Error Updated",
      description: `Error ${selectedError.errorCode} marked as ${statusConfig[status].label}`,
    })
    setIsResolveModalOpen(false)
  }

  const handleStatusChange = (errorId: string, newStatus: ErrorStatus) => {
    setErrors((prev) => prev.map((e) => (e.id === errorId ? { ...e, status: newStatus } : e)))
    toast({
      title: "Status Updated",
      description: `Error status changed to ${statusConfig[newStatus].label}`,
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
          <h2 className="font-serif text-2xl font-bold text-gray-900">System Errors</h2>
          <p className="text-sm text-gray-500">Monitor and resolve system errors and exceptions</p>
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
              <DropdownMenuItem key={key} onClick={() => setStatusFilter(key as ErrorStatus)}>
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
            <CardDescription>Open Errors</CardDescription>
            <CardTitle className="text-2xl text-red-600">{errors.filter((e) => e.status === "open").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Investigating</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {errors.filter((e) => e.status === "investigating").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Fixed</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {errors.filter((e) => e.status === "fixed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Critical</CardDescription>
            <CardTitle className="text-2xl text-red-700">
              {errors.filter((e) => e.severity === "critical" && e.status !== "fixed").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Errors Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Error Code</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Occurrences</TableHead>
              <TableHead>Last Occurred</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredErrors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  No errors found
                </TableCell>
              </TableRow>
            ) : (
              filteredErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Bug className="size-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium">{error.errorCode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{error.message}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Server className="size-3" />
                        {error.source}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityConfig[error.severity].color}>
                      {severityConfig[error.severity].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${statusConfig[error.status].color}`}>
                      {statusConfig[error.status].icon}
                      {statusConfig[error.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{error.occurrences}</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(error.lastOccurred)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(error)}>
                        <Eye className="size-4" />
                      </Button>
                      {(error.status === "open" || error.status === "investigating") && (
                        <>
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleOpenResolveModal(error)}
                          >
                            <CheckCircle2 className="size-3" />
                            Resolve
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                Status
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {error.status !== "investigating" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(error.id, "investigating")}>
                                  <RefreshCw className="mr-2 size-4 text-amber-600" />
                                  Start Investigating
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleStatusChange(error.id, "wont-fix")}>
                                <Clock className="mr-2 size-4 text-gray-600" />
                                Won't Fix
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

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <Bug className="size-5 text-red-600" />
              Error Details
            </DialogTitle>
            <DialogDescription>View detailed error information and stack trace</DialogDescription>
          </DialogHeader>

          {selectedError && (
            <div className="space-y-4">
              {/* Error Summary */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="font-mono text-lg font-bold">{selectedError.errorCode}</p>
                  <p className="text-sm text-gray-600">{selectedError.message}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={severityConfig[selectedError.severity].color}>
                    {severityConfig[selectedError.severity].label}
                  </Badge>
                  <Badge className={`gap-1 ${statusConfig[selectedError.status].color}`}>
                    {statusConfig[selectedError.status].icon}
                    {statusConfig[selectedError.status].label}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedError.description}</p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="font-medium">{selectedError.source}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Occurrences</p>
                  <p className="font-medium">{selectedError.occurrences}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">First Occurred</p>
                  <p className="font-medium">{formatDate(selectedError.firstOccurred)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Last Occurred</p>
                  <p className="font-medium">{formatDate(selectedError.lastOccurred)}</p>
                </div>
              </div>

              {/* Stack Trace */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Stack Trace</h4>
                <ScrollArea className="h-32 rounded-lg bg-gray-900 p-3">
                  <pre className="font-mono text-xs text-green-400">{selectedError.stackTrace}</pre>
                </ScrollArea>
              </div>

              {/* Resolution (if exists) */}
              {selectedError.resolution && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-green-800">
                    <CheckCircle2 className="size-4" />
                    Resolution
                  </h4>
                  <p className="mt-1 text-sm text-green-700">{selectedError.resolution}</p>
                  {selectedError.resolvedAt && (
                    <p className="mt-2 text-xs text-green-600">Resolved on {formatDate(selectedError.resolvedAt)}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Modal */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <CheckCircle2 className="size-5 text-green-600" />
              Resolve Error
            </DialogTitle>
            <DialogDescription>Add resolution notes for {selectedError?.errorCode}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Resolution Notes</label>
              <Textarea
                rows={4}
                className="mt-1 w-full"
                placeholder="Describe how the error was resolved..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-gray-600 bg-transparent"
              onClick={() => handleResolveError("wont-fix")}
            >
              <Clock className="mr-2 size-4" />
              Won't Fix
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleResolveError("fixed")}>
              <CheckCircle2 className="mr-2 size-4" />
              Mark Fixed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
