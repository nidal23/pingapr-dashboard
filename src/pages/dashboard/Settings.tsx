// src/pages/dashboard/Settings.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/stores/authStore";
import { 
  AlertCircle, 
  Clock, 
  Archive, 
  Trash2, 
  Save, 
  Settings as SettingsIcon,
  Github,
  Slack,
  Bell,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Settings state
  const [settings, setSettings] = useState({
    prReminderHours: 24,
    channelArchiveDays: 7,
    githubConnected: false,
    slackConnected: false,
    organizationName: ""
  });

  // Fetch organization settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/onboarding/status');
        
        setSettings({
          prReminderHours: data.settings?.prReminderHours || 24,
          channelArchiveDays: data.settings?.channelArchiveDays || 7,
          githubConnected: data.githubConnected || false,
          slackConnected: data.slackConnected || false,
          organizationName: data.organizationName || ""
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle saving settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.post('/onboarding/complete', { 
        settings: {
          prReminderHours: settings.prReminderHours,
          channelArchiveDays: settings.channelArchiveDays,
        }
      });
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle organization deletion
  const handleDeleteOrganization = async () => {
    if (deleteConfirmation !== user?.email) {
      toast.error("Email confirmation doesn't match");
      return;
    }

    setIsDeleting(true);
    try {
      // This would be a call to delete the organization
      await api.delete('/admin/organization');
      
      // Log the user out after successful deletion
      logout();
      
      // Redirect to home page
      navigate("/");
      
      toast.success("Organization and all associated data deleted successfully");
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast.error("Failed to delete organization");
      setIsDeleting(false);
    }
  };

  // Function to reconnect GitHub
  const reconnectGithub = async () => {
    try {
      const { data } = await api.get('/github/installation-url');
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to get GitHub installation URL:", error);
      toast.error("Failed to initiate GitHub reconnection");
    }
  };

  // Function to reconnect Slack
  const reconnectSlack = async () => {
    try {
      const { data } = await api.get('/slack/auth-url');
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to get Slack auth URL:", error);
      toast.error("Failed to initiate Slack reconnection");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage your organization settings</p>
          </div>
          
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your organization settings and preferences</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Basic settings for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input 
                    id="organization-name" 
                    value={settings.organizationName}
                    onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                    placeholder="Enter organization name"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  PR Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure when to send reminders for open pull requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="pr-reminder">PR Reminder Frequency</Label>
                      <span className="text-sm text-muted-foreground">{settings.prReminderHours} hours</span>
                    </div>
                    <Slider 
                      id="pr-reminder"
                      min={1} 
                      max={72} 
                      step={1}
                      value={[settings.prReminderHours]} 
                      onValueChange={(value) => setSettings({...settings, prReminderHours: value[0]})}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Reminders will be sent for PRs that have been open for longer than this period without activity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Channel Archiving Settings
                </CardTitle>
                <CardDescription>
                  Configure when to archive Slack channels for closed or merged PRs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="channel-archive">Channel Archive Delay</Label>
                      <span className="text-sm text-muted-foreground">{settings.channelArchiveDays} days</span>
                    </div>
                    <Slider 
                      id="channel-archive"
                      min={1} 
                      max={30} 
                      step={1}
                      value={[settings.channelArchiveDays]} 
                      onValueChange={(value) => setSettings({...settings, channelArchiveDays: value[0]})}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Slack channels will be automatically archived this many days after a PR is closed or merged.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control what notifications are sent to your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <Separator />
            
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Manage your GitHub connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Connection Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {settings.githubConnected 
                        ? "Your GitHub organization is connected" 
                        : "GitHub is not connected"}
                    </p>
                  </div>
                  {settings.githubConnected ? (
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                      Connected
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                      Disconnected
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={settings.githubConnected ? "secondary" : "default"}
                  onClick={reconnectGithub}
                  className="gap-2 cursor-pointer"
                >
                  <Github className="h-4 w-4" />
                  {settings.githubConnected ? "Reconnect GitHub" : "Connect GitHub"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Slack className="h-5 w-5" />
                  Slack Integration
                </CardTitle>
                <CardDescription>
                  Manage your Slack connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Connection Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {settings.slackConnected 
                        ? "Your Slack workspace is connected" 
                        : "Slack is not connected"}
                    </p>
                  </div>
                  {settings.slackConnected ? (
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                      Connected
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium">
                      Disconnected
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={settings.slackConnected ? "secondary" : "outline"}
                  onClick={reconnectSlack}
                  className="gap-2 cursor-pointer"
                >
                  <Slack className="h-4 w-4" />
                  {settings.slackConnected ? "Reconnect Slack" : "Connect Slack"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="danger" className="space-y-6 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Danger Zone</AlertTitle>
              <AlertDescription>
                Actions in this section can permanently delete your data.
              </AlertDescription>
            </Alert>
            
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-500 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete Organization
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Permanently delete your organization and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  This action cannot be undone. It will permanently delete your organization,
                  all repositories, users, pull requests, and any other associated data.
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                        Confirm Organization Deletion
                      </DialogTitle>
                      <DialogDescription>
                        This action is irreversible. All data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You will lose access to all your organization's data, including:
                          <ul className="list-disc ml-5 mt-2">
                            <li>All PR history and comments</li>
                            <li>All user mappings and settings</li>
                            <li>All Slack channel connections</li>
                            <li>All team configurations</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirmation">
                          Please type <span className="font-medium">{user?.email}</span> to confirm
                        </Label>
                        <Input 
                          id="delete-confirmation"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Enter your email"
                          className="border-red-300 focus-visible:ring-red-400"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setDeleteConfirmation("")}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteOrganization}
                        disabled={isDeleting || deleteConfirmation !== user?.email}
                        className="gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Permanently Delete
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;