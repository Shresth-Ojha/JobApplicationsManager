import { useEffect, useState, useMemo, useRef } from "react"
import { Plus, LayoutGrid, LayoutList, ExternalLink, Search, Filter, ChevronDown, ChevronUp, Calendar, Building2, StickyNote, Download, FileText, FileSpreadsheet } from "lucide-react"
import { Link } from "react-router-dom"
import { applicationService } from "@/services/applicationService"
import type { Application } from "@/types/application"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { exportToCSV, exportToPDF } from "@/utils/exportUtils"

const STATUS_OPTIONS = [
    { value: 'ALL', label: 'All Statuses', color: 'bg-gray-500' },
    { value: 'APPLIED', label: 'Applied', color: 'bg-blue-500' },
    { value: 'SCREENING', label: 'Screening', color: 'bg-cyan-500' },
    { value: 'PHONE_INTERVIEW', label: 'Phone Interview', color: 'bg-indigo-500' },
    { value: 'TECHNICAL_INTERVIEW', label: 'Technical Interview', color: 'bg-purple-500' },
    { value: 'ONSITE_INTERVIEW', label: 'Onsite Interview', color: 'bg-violet-500' },
    { value: 'OFFER_RECEIVED', label: 'Offer Received', color: 'bg-green-500' },
    { value: 'ACCEPTED', label: 'Accepted', color: 'bg-emerald-600' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
    { value: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-gray-500' },
]

const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Newest First', icon: Calendar },
    { value: 'date-asc', label: 'Oldest First', icon: Calendar },
    { value: 'company-asc', label: 'Company A-Z', icon: Building2 },
    { value: 'company-desc', label: 'Company Z-A', icon: Building2 },
]

// Highlight matching text
function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/40 text-inherit px-0.5 rounded">{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    )
}

// Expandable notes component
function ExpandableNotes({ notes, query }: { notes: string; query: string }) {
    const [expanded, setExpanded] = useState(false)
    const isLong = notes.length > 100
    const displayText = expanded || !isLong ? notes : notes.substring(0, 100) + '...'

    return (
        <div className="mt-2">
            <div className="flex items-start gap-1 text-xs text-muted-foreground">
                <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="italic">
                    <HighlightText text={displayText} query={query} />
                </span>
            </div>
            {isLong && (
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
                    className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5"
                >
                    {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Show more</>}
                </button>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const opt = STATUS_OPTIONS.find(s => s.value === status)
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${opt?.color || 'bg-gray-500'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
            {status.replace(/_/g, ' ')}
        </span>
    )
}

// Interactive status dropdown for quick updates
function StatusDropdown({ application, onStatusChange }: { application: Application; onStatusChange: (id: string, status: string) => Promise<void> }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const currentOpt = STATUS_OPTIONS.find(s => s.value === application.status)

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === application.status) {
            setIsOpen(false)
            return
        }
        setIsUpdating(true)
        try {
            await onStatusChange(application.id, newStatus)
        } finally {
            setIsUpdating(false)
            setIsOpen(false)
        }
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.bottom + 4,
                left: rect.left
            })
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                disabled={isUpdating}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white transition-all hover:ring-2 hover:ring-offset-1 hover:ring-primary/50 ${currentOpt?.color || 'bg-gray-500'} ${isUpdating ? 'opacity-60' : ''}`}
            >
                {isUpdating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                )}
                {application.status.replace(/_/g, ' ')}
                <ChevronDown className="w-3 h-3" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
                    <div
                        className="fixed z-[101] bg-popover border rounded-lg shadow-xl py-1 min-w-[180px]"
                        style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    >
                        {STATUS_OPTIONS.filter(opt => opt.value !== 'ALL').map((opt) => (
                            <button
                                key={opt.value}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(opt.value) }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${opt.value === application.status ? 'bg-muted font-medium' : ''
                                    }`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`}></span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState('date-desc')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        loadApplications()
    }, [])

    const loadApplications = async () => {
        try {
            const data = await applicationService.getAll()
            setApplications(data)
        } catch (error) {
            console.error("Failed to load applications", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        await applicationService.update(id, { status: newStatus as any })
        setApplications(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus as any } : app
        ))
    }

    const processedApplications = useMemo(() => {
        let result = [...applications]

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(app =>
                app.companyName.toLowerCase().includes(query) ||
                app.positionTitle.toLowerCase().includes(query) ||
                (app.notes && app.notes.toLowerCase().includes(query))
            )
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            result = result.filter(app => app.status === statusFilter)
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
                case 'date-asc':
                    return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
                case 'company-asc':
                    return a.companyName.localeCompare(b.companyName)
                case 'company-desc':
                    return b.companyName.localeCompare(a.companyName)
                default:
                    return 0
            }
        })

        return result
    }, [applications, searchQuery, statusFilter, sortBy])

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <div className="flex items-center gap-2">
                        {/* Export Dropdown */}
                        <div className="relative group">
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                            <div className="absolute right-0 mt-1 w-40 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <button
                                    onClick={() => exportToCSV(processedApplications)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors rounded-t-lg"
                                >
                                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                    Export as CSV
                                </button>
                                <button
                                    onClick={() => exportToPDF(processedApplications)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors rounded-b-lg"
                                >
                                    <FileText className="h-4 w-4 text-red-500" />
                                    Export as PDF
                                </button>
                            </div>
                        </div>
                        <Button asChild className="shadow-lg">
                            <Link to="/applications/new">
                                <Plus className="mr-2 h-4 w-4" /> Add Application
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by company, role, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center bg-muted rounded-lg p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 w-9 p-0 ${viewMode === 'list' ? 'bg-background shadow-sm' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 w-9 p-0 ${viewMode === 'grid' ? 'bg-background shadow-sm' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg border">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
                Showing {processedApplications.length} of {applications.length} applications
            </p>

            {/* Empty State */}
            {processedApplications.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/30">
                    {searchQuery || statusFilter !== 'ALL' ? (
                        <div className="space-y-2">
                            <p className="text-lg font-medium">No matching applications</p>
                            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
                            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('ALL') }}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-lg font-medium">No applications yet</p>
                            <p className="text-muted-foreground text-sm">Start tracking your job search journey!</p>
                            <Button asChild className="mt-2">
                                <Link to="/applications/new"><Plus className="mr-2 h-4 w-4" /> Add Your First Application</Link>
                            </Button>
                        </div>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {processedApplications.map((app) => (
                        <Card key={app.id} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden flex flex-col">
                            <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary"></div>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1 min-w-0">
                                        <h3 className="font-semibold text-lg leading-tight truncate">
                                            <HighlightText text={app.companyName} query={searchQuery} />
                                        </h3>
                                        <p className="text-sm font-medium text-primary truncate">
                                            <HighlightText text={app.positionTitle} query={searchQuery} />
                                        </p>
                                    </div>
                                    <StatusDropdown application={app} onStatusChange={handleStatusChange} />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3 flex-1">
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(app.applicationDate).toLocaleDateString()}
                                    </span>
                                    <span>{app.locationCity || 'Remote'}</span>
                                </div>

                                {app.notes && <ExpandableNotes notes={app.notes} query={searchQuery} />}

                                {app.jobUrl && (
                                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                                        <ExternalLink className="h-3.5 w-3.5" /> View Posting
                                    </a>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0 mt-auto">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link to={`/applications/${app.id}`}>Edit Application</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Position</th>
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Location</th>
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Applied</th>
                                    <th className="h-12 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Notes</th>
                                    <th className="h-12 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedApplications.map((app, idx) => (
                                    <tr key={app.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                                        <td className="p-4">
                                            <div className="font-medium">
                                                <HighlightText text={app.companyName} query={searchQuery} />
                                            </div>
                                            {app.jobUrl && (
                                                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                                                    <ExternalLink className="h-3 w-3" /> Job Posting
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium">
                                                <HighlightText text={app.positionTitle} query={searchQuery} />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusDropdown application={app} onStatusChange={handleStatusChange} />
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">{app.locationCity || 'Remote'}</td>
                                        <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{new Date(app.applicationDate).toLocaleDateString()}</td>
                                        <td className="p-4 hidden xl:table-cell max-w-xs">
                                            {app.notes ? (
                                                <ExpandableNotes notes={app.notes} query={searchQuery} />
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50 italic">No notes</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link to={`/applications/${app.id}`}>Edit</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
