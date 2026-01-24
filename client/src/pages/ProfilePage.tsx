import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { Loader2, ChevronDown, ChevronUp, Plus, Trash2, FileText, MapPin, GraduationCap, Briefcase, Link as LinkIcon, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

// Profile form schema
const profileSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email(),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    resumeUrl: z.string().url().optional().or(z.literal("")),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EducationEntry {
    id: string
    institution: string
    degree: string
    field: string
    startYear: string
    endYear: string
}

interface ExperienceEntry {
    id: string
    company: string
    title: string
    location: string
    startDate: string
    endDate: string
    description: string
}

// Collapsible Section Component
function CollapsibleSection({
    title,
    icon: Icon,
    children,
    defaultOpen = false,
    badge
}: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
    defaultOpen?: boolean
    badge?: string
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <Card>
            <CardHeader
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base">{title}</CardTitle>
                            {badge && <CardDescription className="text-xs">{badge}</CardDescription>}
                        </div>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
            </CardHeader>
            {isOpen && <CardContent className="pt-0">{children}</CardContent>}
        </Card>
    )
}

export default function ProfilePage() {
    const { user, login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [education, setEducation] = useState<EducationEntry[]>([])
    const [experience, setExperience] = useState<ExperienceEntry[]>([])

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            countryCode: '+1',
            phone: '',
            resumeUrl: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
        }
    })

    // Load user profile data
    useEffect(() => {
        // In a real app, we'd fetch full profile from API
        // For now, use what's in the store
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            })
        }
    }, [user, reset])

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true)
        setSuccessMessage(null)
        setErrorMessage(null)
        try {
            const updated = await authService.updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                // Add other fields when backend supports them
            })
            const token = useAuthStore.getState().token
            if (token) login(updated.user, token)
            setSuccessMessage("Profile saved successfully")
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || "Failed to save profile")
        } finally {
            setIsLoading(false)
        }
    }

    const addEducation = () => {
        setEducation([...education, {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            startYear: '',
            endYear: ''
        }])
    }

    const removeEducation = (id: string) => {
        setEducation(education.filter(e => e.id !== id))
    }

    const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
        setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e))
    }

    const addExperience = () => {
        setExperience([...experience, {
            id: Date.now().toString(),
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        }])
    }

    const removeExperience = (id: string) => {
        setExperience(experience.filter(e => e.id !== id))
    }

    const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) => {
        setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e))
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground text-sm">Manage your personal information for job applications</p>
                </div>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
                    ✓ {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                    ✕ {errorMessage}
                </div>
            )}

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your name, email, and contact details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" {...register("firstName")} />
                                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" {...register("lastName")} />
                                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...register("email")} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="countryCode"
                                        {...register("countryCode")}
                                        placeholder="+1"
                                        className="w-20 text-center"
                                    />
                                    <Input
                                        id="phone"
                                        {...register("phone")}
                                        placeholder="(555) 000-0000"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Resume */}
            <CollapsibleSection
                title="Resume / CV"
                icon={FileText}
                badge="Add a link to your resume"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="resumeUrl">Resume URL</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="resumeUrl"
                                    {...register("resumeUrl")}
                                    placeholder="https://drive.google.com/... or https://dropbox.com/..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Link to your resume on Google Drive, Dropbox, or any public URL
                        </p>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Address */}
            <CollapsibleSection
                title="Address"
                icon={MapPin}
                badge="Your mailing address for applications"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" {...register("addressLine1")} placeholder="Street address" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input id="addressLine2" {...register("addressLine2")} placeholder="Apartment, suite, etc." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...register("city")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" {...register("state")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...register("country")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" {...register("postalCode")} />
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection
                title="Education"
                icon={GraduationCap}
                badge={education.length > 0 ? `${education.length} entries` : "Add your educational background"}
            >
                <div className="space-y-4">
                    {education.map((edu, idx) => (
                        <div key={edu.id} className="p-4 border rounded-lg space-y-3 bg-muted/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Education #{idx + 1}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeEducation(edu.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Institution</Label>
                                <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University / College name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="e.g. Bachelor's" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Field of Study</Label>
                                    <Input value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="e.g. Computer Science" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Year</Label>
                                    <Input value={edu.startYear} onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)} placeholder="2018" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Year</Label>
                                    <Input value={edu.endYear} onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)} placeholder="2022" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addEducation} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Education
                    </Button>
                </div>
            </CollapsibleSection>

            {/* Experience */}
            <CollapsibleSection
                title="Work Experience"
                icon={Briefcase}
                badge={experience.length > 0 ? `${experience.length} entries` : "Add your work history"}
            >
                <div className="space-y-4">
                    {experience.map((exp, idx) => (
                        <div key={exp.id} className="p-4 border rounded-lg space-y-3 bg-muted/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Experience #{idx + 1}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeExperience(exp.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} placeholder="Your role" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} placeholder="City, Country" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                    placeholder="Brief description of your responsibilities..."
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addExperience} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                </div>
            </CollapsibleSection>
        </div>
    )
}
