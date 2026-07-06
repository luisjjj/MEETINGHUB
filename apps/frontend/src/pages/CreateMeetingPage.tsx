import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateMeeting } from '@/hooks/useMeetings';
import { useDepartments } from '@/hooks/useDepartments';
import { toast } from 'sonner';

const steps = ['Basic Info', 'Schedule', 'Participants', 'Options'];

export default function CreateMeetingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    meetingType: '',
    date: '',
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    location: '',
    room: '',
    format: 'virtual',
    participants: '',
    agenda: '',
    recordingEnabled: true,
    waitingRoomEnabled: false,
    passwordProtected: false,
    password: '',
  });

  const createMeeting = useCreateMeeting();
  const { data: departments } = useDepartments();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      await createMeeting.mutateAsync({
        title: formData.title,
        description: formData.description,
        departmentId: formData.departmentId || undefined,
        meetingType: formData.meetingType as 'board' | 'department' | 'team' | 'one_on_one' | 'all_hands' | 'training' | 'other',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timezone: formData.timezone,
        location: formData.location,
        room: formData.room,
        format: formData.format as 'virtual' | 'in_person' | 'hybrid',
        recordingEnabled: formData.recordingEnabled,
        waitingRoomEnabled: formData.waitingRoomEnabled,
        passwordProtected: formData.passwordProtected,
      });
      toast.success('Meeting created successfully!');
      navigate('/calendar');
    } catch (error) {
      toast.error('Failed to create meeting');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Create Meeting</h1>
        <p className="text-muted-foreground">Set up a new meeting with all the details</p>
      </div>

      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index <= currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">{step}</span>
            {index < steps.length - 1 && <div className="w-12 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  placeholder="Enter meeting title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Meeting description and objectives"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <Select
                    value={formData.meetingType}
                    onValueChange={(value) => setFormData({ ...formData, meetingType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="board">Board Meeting</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="one_on_one">One-on-One</SelectItem>
                      <SelectItem value="all_hands">All Hands</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  placeholder="Search and add participants by email"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  placeholder="Meeting agenda items (one per line)"
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Meeting Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual (Zoom)</SelectItem>
                    <SelectItem value="in_person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location / Room</Label>
                <Input
                  id="location"
                  placeholder="Meeting location or room name"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.recordingEnabled}
                    onChange={(e) =>
                      setFormData({ ...formData, recordingEnabled: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Enable recording</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.waitingRoomEnabled}
                    onChange={(e) =>
                      setFormData({ ...formData, waitingRoomEnabled: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Enable waiting room</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.passwordProtected}
                    onChange={(e) =>
                      setFormData({ ...formData, passwordProtected: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Password protect meeting</span>
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} disabled={createMeeting.isPending}>
            {createMeeting.isPending ? 'Creating...' : 'Create Meeting'}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
