import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { applicationService } from "@/services/applicationService"

const formSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    positionTitle: z.string().min(1, "Position title is required"),
    jobUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    locationCity: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateApplicationPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: 'APPLIED',
            priority: 'MEDIUM'
        }
    })

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        try {
            await applicationService.create(data)
            navigate("/applications")
        } catch (error) {
            console.error("Failed to create application", error)
            alert("Failed to create application")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Application</CardTitle>
                    <CardDescription>Track a new job opportunity</CardDescription>
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
                            <Label htmlFor="jobUrl">Job Posting URL (Optional)</Label>
                            <Input id="jobUrl" {...register("jobUrl")} />
                            {errors.jobUrl && <p className="text-red-500 text-xs">{errors.jobUrl.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    {...register("status")}
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="SCREENING">Screening</option>
                                    <option value="PHONE_INTERVIEW">Phone Interview</option>
                                    <option value="TECHNICAL_INTERVIEW">Technical Interview</option>
                                    <option value="ONSITE_INTERVIEW">Onsite Interview</option>
                                    <option value="OFFER_RECEIVED">Offer Received</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="WITHDRAWN">Withdrawn</option>
                                </select>
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
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                placeholder="Add any notes about this application..."
                                {...register("notes")}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => navigate("/applications")}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Application
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
