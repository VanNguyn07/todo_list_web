import React, { useState, useRef, useEffect } from "react"
// Cần cài đặt: npm install lucide-react
import { Bug, CheckCircle2, Clock, Eye, RefreshCw, Server, XCircle, MoreVertical, Filter, X } from "lucide-react"

// --- Dữ liệu giả lập ---
const initialErrors = [
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

const statusConfig = {
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

const severityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700" },
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

const Textarea = ({ className, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
)

const Modal = ({ isOpen, onClose, title, description, children, footer }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
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

// --- Main Component ---

export default function SystemErrors() {
  const [errors, setErrors] = useState(initialErrors)
  const [selectedError, setSelectedError] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Hàm giả lập Toast
  const showToast = ({ title, description }) => {
    // Trong thực tế bạn có thể thay bằng console.log hoặc thư viện toast khác
    alert(`${title}: ${description}`)
  }

  const filteredErrors = statusFilter === "all" ? errors : errors.filter((e) => e.status === statusFilter)

  const handleViewDetails = (error) => {
    setSelectedError(error)
    setIsDetailModalOpen(true)
  }

  const handleOpenResolveModal = (error) => {
    setSelectedError(error)
    setResolutionNotes("")
    setIsResolveModalOpen(true)
  }

  const handleResolveError = (status) => {
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

    showToast({
      title: "Error Updated",
      description: `Error ${selectedError.errorCode} marked as ${statusConfig[status].label}`,
    })
    setIsResolveModalOpen(false)
  }

  const handleStatusChange = (errorId, newStatus) => {
    setErrors((prev) => prev.map((e) => (e.id === errorId ? { ...e, status: newStatus } : e)))
    showToast({
      title: "Status Updated",
      description: `Error status changed to ${statusConfig[newStatus].label}`,
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
          <h2 className="text-3xl font-bold text-gray-900">System Errors</h2>
          <p className="text-1xl text-gray-500">Monitor and resolve system errors and exceptions</p>
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
            <p className="text-1xl text-gray-1000">Open Errors</p>
            <h3 className="text-2xl font-bold text-red-600">
                {errors.filter((e) => e.status === "open").length}
            </h3>
            <p className="text-sm text-gray-500">Unresolved errors still exist in the system.</p>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-1xl text-gray-1000">Investigating</p>
            <h3 className="text-2xl font-bold text-amber-600">
                {errors.filter((e) => e.status === "investigating").length}
            </h3>
             <p className="text-sm text-gray-500">The cause is under investigation; there is no fix yet.</p>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-1xl text-gray-1000">Fixed</p>
            <h3 className="text-2xl font-bold text-green-600">
                {errors.filter((e) => e.status === "fixed").length}
            </h3>
             <p className="text-sm text-gray-500">It's fixed now, it won't happen again.</p>
        </Card>
        <Card className="p-6 border shadow-sm">
            <p className="text-1xl text-gray-1000">Won't Fix</p>
            <h3 className="text-2xl font-bold text-gray-600">
                {errors.filter((e) => e.severity === "critical" && e.status !== "fixed").length}
            </h3>
             <p className="text-sm text-gray-500">Knowing the mistake but not correcting it (accepting it).</p>
        </Card>
      </div>

      {/* Errors Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b bg-gray-50 transition-colors hover:bg-gray-50/50">
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Error Code</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Message</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Severity</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Status</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Occurrences</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500">Last Occurred</th>
                <th className="h-12 px-4 align-middle font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredErrors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center h-32 text-gray-500">
                    No errors found
                  </td>
                </tr>
              ) : (
                filteredErrors.map((error) => (
                  <tr key={error.id} className="border-b transition-colors hover:bg-gray-50/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Bug className="size-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium">{error.errorCode}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <p className="font-medium text-gray-900">{error.message}</p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <Server className="size-3" />
                          {error.source}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={severityConfig[error.severity].color}>
                        {severityConfig[error.severity].label}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={`gap-1 ${statusConfig[error.status].color}`}>
                        {statusConfig[error.status].icon}
                        {statusConfig[error.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="font-medium text-gray-900">{error.occurrences}</span>
                    </td>
                    <td className="p-4 align-middle text-sm text-gray-500">{formatDate(error.lastOccurred)}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(error)}>
                          <Eye className="size-4" />
                        </Button>
                        
                        {(error.status === "open" || error.status === "investigating") && (
                          <>
                            <Button
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleOpenResolveModal(error)}
                            >
                              <CheckCircle2 className="size-3" />
                              Resolve
                            </Button>
                            
                            <SimpleDropdown 
                                trigger={
                                    <Button size="sm" variant="outline">
                                        Status
                                    </Button>
                                }
                                align="right"
                                items={[
                                    ...(error.status !== "investigating" ? [{
                                        label: <><RefreshCw className="mr-2 size-4 text-amber-600" />Start Investigating</>,
                                        onClick: () => handleStatusChange(error.id, "investigating")
                                    }] : []),
                                    {
                                        label: <><Clock className="mr-2 size-4 text-gray-600" />Won't Fix</>,
                                        onClick: () => handleStatusChange(error.id, "wont-fix")
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

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={
            <div className="flex items-center gap-2 font-serif">
               <Bug className="size-5 text-red-600" /> Error Details
            </div>
        }
        description="View detailed error information and stack trace"
        footer={
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
        }
      >
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
                <div className="h-32 rounded-lg bg-gray-900 p-3 overflow-auto">
                  <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">{selectedError.stackTrace}</pre>
                </div>
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
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={
            <div className="flex items-center gap-2 font-serif">
               <CheckCircle2 className="size-5 text-green-600" /> Resolve Error
            </div>
        }
        description={`Add resolution notes for ${selectedError?.errorCode}`}
        footer={
            <div className="flex gap-2 w-full justify-end">
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
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleResolveError("fixed")}>
                <CheckCircle2 className="mr-2 size-4" />
                Mark Fixed
                </Button>
            </div>
        }
      >
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
      </Modal>
    </div>
  )
}