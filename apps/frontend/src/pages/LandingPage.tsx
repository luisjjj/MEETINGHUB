import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Video, Brain, BarChart3, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Smart Scheduling',
    description: 'Schedule meetings with intelligent conflict detection and timezone support.',
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: 'Zoom Integration',
    description: 'Create and manage Zoom meetings directly from the platform with auto-sync.',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI Summaries',
    description: 'Get AI-generated meeting summaries, action items, and key decisions.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Participant Management',
    description: 'Invite attendees, track RSVPs, and manage meeting roles effortlessly.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Analytics Dashboard',
    description: 'Visualize meeting trends, attendance rates, and department activity.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Enterprise Security',
    description: 'Role-based access control, secure authentication, and audit logging.',
  },
];

const stats = [
  { value: '500+', label: 'Meetings Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50+', label: 'Organizations' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary-500 flex items-center justify-center">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-slate-900">MeetingHub</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                <Button onClick={() => navigate('/register')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            Enterprise Meeting Management
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Meetings that<br />
            <span className="text-primary-500">actually work</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Schedule, manage, and record your meetings with AI-powered summaries,
            Zoom integration, and real-time analytics. Built for teams that value their time.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            A complete meeting management platform with tools your team will actually use.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your meetings?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            Join teams that run better meetings with MeetingHub. Free to get started, no credit card required.
          </p>
          <Button size="lg" variant="secondary" className="text-base px-8 h-12" onClick={() => navigate('/register')}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MeetingHub. All rights reserved.</p>
          <p>Enterprise Meeting Management Platform</p>
        </div>
      </footer>
    </div>
  );
}
