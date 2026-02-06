import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ExternalLink, ArrowLeft, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { applicationService } from "@/services/applicationService"
import type { Application } from "@/types/application"

const formSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    positionTitle: z.string().min(1, "Position title is required"),
    jobUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    jobDescription: z.string().optional(),
    locationCity: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type FormValues = z.infer<typeof formSchema>

const STATUS_OPTIONS = [
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

export default function EditApplicationPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [application, setApplication] = useState<Application | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    const currentStatus = watch('status')

    useEffect(() => {
        if (id) {
            loadApplication()
        }
    }, [id])

    const loadApplication = async () => {
        try {
            const data = await applicationService.getById(id!)
            setApplication(data)
            reset({
                companyName: data.companyName,
                positionTitle: data.positionTitle,
                jobUrl: data.jobUrl || '',
                jobDescription: data.jobDescription || '',
                locationCity: data.locationCity || '',
                notes: data.notes || '',
                status: data.status,
                priority: data.priority,
            })
        } catch (error) {
            console.error("Failed to load application", error)
            setErrorMessage("Failed to load application")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true)
        setSuccessMessage(null)
        setErrorMessage(null)
        try {
            await applicationService.update(id!, data)
            setSuccessMessage("Application updated successfully")
            loadApplication() // Refresh data
        } catch (error) {
            console.error("Failed to update application", error)
            setErrorMessage("Failed to update application")
        } finally {
            setIsSaving(false)
        }
    }

    const handleStatusChange = (newStatus: string) => {
        setValue('status', newStatus as any)
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this application?")) return
        setIsDeleting(true)
        try {
            await applicationService.delete(id!)
            navigate("/applications")
        } catch (error) {
            setErrorMessage("Failed to delete application")
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!application) {
        return <div className="text-center py-12 text-muted-foreground">Application not found</div>
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/applications"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{application.positionTitle}</h1>
                        <p className="text-sm text-muted-foreground">{application.companyName} • Applied {new Date(application.applicationDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {application.jobUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" /> Job Posting
                            </a>
                        </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {successMessage && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-medium">
                    ✓ {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
                    ✕ {errorMessage}
                </div>
            )}

            {/* Two Column Layout: Status + Form */}
            <div className="flex gap-4">
                {/* Status Pipeline - Left Column (auto width) */}
                <Card className="shrink-0 self-start">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <div className="flex flex-col gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusChange(opt.value)}
                                    disabled={isSaving}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap ${currentStatus === opt.value
                                        ? `${opt.color} text-white shadow-md`
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form - Takes remaining space */}
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Application Details</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0 flex-1 flex flex-col">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="companyName" className="text-xs">Company Name</Label>
                                        <Input id="companyName" className="h-9" {...register("companyName")} />
                                        {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="positionTitle" className="text-xs">Position Title</Label>
                                        <Input id="positionTitle" className="h-9" {...register("positionTitle")} />
                                        {errors.positionTitle && <p className="text-red-500 text-xs">{errors.positionTitle.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1 col-span-2">
                                        <Label htmlFor="jobUrl" className="text-xs">Job Posting URL</Label>
                                        <Input id="jobUrl" className="h-9" {...register("jobUrl")} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="priority" className="text-xs">Priority</Label>
                                        <select
                                            id="priority"
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            {...register("priority")}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="locationCity" className="text-xs">Location</Label>
                                    <Input id="locationCity" className="h-9" {...register("locationCity")} placeholder="City, Country" />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="notes" className="text-xs">Notes</Label>
                                    <textarea
                                        id="notes"
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                        {...register("notes")}
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/applications")}>Cancel</Button>
                                <Button type="submit" size="sm" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
