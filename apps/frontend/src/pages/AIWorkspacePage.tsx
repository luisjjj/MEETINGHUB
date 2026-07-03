import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const summaryTypes = [
  { id: 'executive', label: 'Executive Summary', description: 'High-level overview for stakeholders' },
  { id: 'detailed', label: 'Detailed Summary', description: 'Comprehensive meeting summary' },
  { id: 'action_items', label: 'Action Items', description: 'Extract tasks and responsibilities' },
  { id: 'decisions', label: 'Key Decisions', description: 'Important decisions made' },
  { id: 'email', label: 'Follow-up Email', description: 'Professional follow-up email' },
];

export default function AIWorkspacePage() {
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(
        `Executive Summary\n\nThe Q4 Board Review meeting was conducted on December 15, 2024, with 4 key participants. The meeting focused on financial performance review, strategic initiatives update, budget approval, and a Q&A session.\n\nKey Highlights:\n• Revenue increased by 15% compared to Q3\n• Three new strategic initiatives were approved for Q1 2025\n• Budget allocation of $2.5M was approved for the upcoming quarter\n• Market expansion plans for Southeast Asia were discussed\n\nAction Items:\n1. John Doe to prepare detailed budget proposal by Dec 20\n2. Jane Smith to distribute meeting minutes (completed)\n3. Mike Johnson to schedule follow-up meeting by Dec 18\n\nNext Steps:\nThe leadership team will reconvene in January for the Q1 kickoff meeting.`
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Workspace</h1>
          <p className="text-muted-foreground">Generate AI-powered summaries and insights</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Meeting</label>
                <Select value={selectedMeeting} onValueChange={setSelectedMeeting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Q4 Board Review</SelectItem>
                    <SelectItem value="2">Product Strategy Meeting</SelectItem>
                    <SelectItem value="3">Engineering Standup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <div className="space-y-2">
                  {summaryTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${
                        selectedType === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={!selectedMeeting || !selectedType || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />Copy
                  </Button>
                  <Button size="sm">
                    <Send className="mr-2 h-4 w-4" />Send Email
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="success"><CheckCircle className="mr-1 h-3 w-3" />Generated</Badge>
                  </div>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a meeting and content type to generate AI-powered insights
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
