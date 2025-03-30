
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Moon, 
  Bell, 
  Globe, 
  Shield, 
  Key, 
  Languages, 
  Palette,
  Upload,
  Trash2,
  RefreshCw,
  LogOut,
  Mail
} from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, darkMode, toggleDarkMode, updateUserProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: 'user@example.com',
    language: 'english',
    theme: darkMode ? 'dark' : 'light',
    enableNotifications: true,
    emailNotifications: true,
    autoSaveInterval: 5,
    chatCompletions: true,
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [authMethod, setAuthMethod] = useState<string>('password');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      avatar: avatarPreview,
    });
    
    toast({
      title: "Settings updated",
      description: "Your profile settings have been saved successfully"
    });
    
    navigate('/');
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAvatar = () => {
    setAvatarPreview(null);
  };
  
  const resetSettings = () => {
    // Reset all settings to default
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values"
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    // In a real app, this would clear authentication state
    navigate('/');
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password change email sent",
      description: "Please check your email for password reset instructions"
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User size={24} />
          Profile Settings
        </h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4 sm:w-1/3">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                  </div>
                  <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    asChild
                  >
                    <label>
                      <Upload size={14} />
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </Button>
                </div>
                
                {avatarPreview && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={removeAvatar}
                    className="gap-2"
                  >
                    <Trash2 size={14} />
                    Remove Avatar
                  </Button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="dark:bg-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="dark:bg-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <div className="flex items-center gap-2">
                    <Languages size={16} className="text-gray-500" />
                    <select 
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  Save Changes
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode" className="flex items-center gap-2">
                    <Moon size={16} />
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Palette size={16} />
                  Accent Color
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => toast({
                        title: "Accent color changed",
                        description: "Theme color updated successfully"
                      })}
                    />
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">A</span>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    defaultValue="16"
                    className="flex-1"
                    onChange={() => toast({
                      title: "Font size updated",
                      description: "Your preferred font size has been saved"
                    })}
                  />
                  <span className="text-lg">A</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize motion for accessibility
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell size={16} />
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new messages
                  </p>
                </div>
                <Switch
                  checked={formData.enableNotifications}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, enableNotifications: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email summaries of conversations
                  </p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, emailNotifications: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Auto-Save Interval (minutes)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={formData.autoSaveInterval}
                    onChange={(e) => setFormData({...formData, autoSaveInterval: Number(e.target.value)})}
                    className="flex-1"
                  />
                  <div className="w-8 text-center">
                    {formData.autoSaveInterval}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically save drafts while typing
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for notifications and events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield size={16} />
                  Authentication Method
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={authMethod === "password" ? "default" : "outline"}
                    onClick={() => setAuthMethod("password")}
                  >
                    Password
                  </Button>
                  <Button
                    variant={authMethod === "2fa" ? "default" : "outline"}
                    onClick={() => setAuthMethod("2fa")}
                  >
                    Two-Factor Auth
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key size={16} />
                  Password
                </Label>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={handlePasswordChange}
                    className="text-left justify-start"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Globe size={16} />
                    API Access
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow third-party applications to access your data
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <Separator />
              
              <div className="space-y-4 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={resetSettings}
                >
                  <RefreshCw size={16} />
                  Reset All Settings
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;
