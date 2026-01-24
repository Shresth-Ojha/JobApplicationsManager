import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ExternalLink, ArrowLeft, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

    const handleStatusChange = async (newStatus: string) => {
        setValue('status', newStatus as any)
        setIsSaving(true)
        setSuccessMessage(null)
        try {
            await applicationService.update(id!, { status: newStatus as any })
            setSuccessMessage("Status updated")
            loadApplication()
        } catch (error) {
            setErrorMessage("Failed to update status")
        } finally {
            setIsSaving(false)
        }
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/applications"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{application.positionTitle}</h1>
                        <p className="text-muted-foreground">{application.companyName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {application.jobUrl && (
                        <Button variant="outline" asChild>
                            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Job Posting
                            </a>
                        </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-medium">
                    ✓ {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
                    ✕ {errorMessage}
                </div>
            )}

            {/* Status Pipeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Application Status</CardTitle>
                    <CardDescription>Click on a status to update</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleStatusChange(opt.value)}
                                disabled={isSaving}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${currentStatus === opt.value
                                        ? `${opt.color} text-white border-transparent shadow-md`
                                        : 'bg-muted text-muted-foreground border-transparent hover:border-primary'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Application Details</CardTitle>
                    <CardDescription>Edit the information about this application</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" {...register("companyName")} />
                                {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="positionTitle">Position Title</Label>
                                <Input id="positionTitle" {...register("positionTitle")} />
                                {errors.positionTitle && <p className="text-red-500 text-xs">{errors.positionTitle.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job Posting URL</Label>
                            <Input id="jobUrl" {...register("jobUrl")} placeholder="https://..." />
                            {errors.jobUrl && <p className="text-red-500 text-xs">{errors.jobUrl.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="locationCity">Location</Label>
                                <Input id="locationCity" {...register("locationCity")} placeholder="City, Country" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <select
                                    id="priority"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    {...register("priority")}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...register("notes")}
                                placeholder="Any additional notes about this application..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => navigate("/applications")}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Metadata */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p>Applied on: {new Date(application.applicationDate).toLocaleDateString()}</p>
                <p>Last updated: {new Date(application.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    )
}
