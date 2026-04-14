import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp, serverTimestamp, query, orderBy, getDocs, where } from 'firebase/firestore';
import { DateEntry, EntryStatus, ActivityLabel } from '@/types';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface AdminEntryFormProps {
  entry?: DateEntry | null;
  onBack: () => void;
  onManageLabels: () => void;
}

const ANIMAL_SIGNS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'link', 'image'
];

export const AdminEntryForm: React.FC<AdminEntryFormProps> = ({ entry, onBack, onManageLabels }) => {
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<ActivityLabel[]>([]);
  const [date, setDate] = useState<Date | undefined>(entry ? entry.entry_date.toDate() : new Date());
  const [title, setTitle] = useState(entry?.title || '');
  const [labelId, setLabelId] = useState(entry?.label_id || '');
  const [doText, setDoText] = useState(entry?.do_text || '');
  const [dontText, setDontText] = useState(entry?.dont_text || '');
  const [summary, setSummary] = useState(entry?.short_summary || '');
  const [animalSigns, setAnimalSigns] = useState<string[]>(entry?.animal_signs || []);
  const [status, setStatus] = useState<EntryStatus>(entry?.status || 'draft');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      const q = query(collection(db, 'activity_labels'), orderBy('created_at', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLabel[];
      setLabels(data);
      
      // If creating new and labels exist, default to first one if none selected
      if (!entry && data.length > 0 && !labelId) {
        setLabelId(data[0].id);
      }
    };
    fetchLabels();
  }, [entry, labelId]);

  const toggleAnimalSign = (sign: string) => {
    setAnimalSigns(prev => 
      prev.includes(sign) 
        ? prev.filter(s => s !== sign) 
        : [...prev, sign]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!date || !labelId) {
      setError('Please select a date and an activity label.');
      return;
    }
    if (!title && !doText && !dontText && !summary) {
      setError('Please fill in at least one content field.');
      return;
    }

    setLoading(true);
    try {
      // Check for duplicate date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const duplicateQuery = query(
        collection(db, 'date_entries'),
        where('entry_date', '>=', Timestamp.fromDate(startOfDay)),
        where('entry_date', '<=', Timestamp.fromDate(endOfDay))
      );
      
      const duplicateSnapshot = await getDocs(duplicateQuery);
      const isDuplicate = duplicateSnapshot.docs.some(doc => !entry || doc.id !== entry.id);

      if (isDuplicate) {
        setError('An entry already exists for this date. Please select a different date.');
        setLoading(false);
        return;
      }

      const data = {
        entry_date: Timestamp.fromDate(date),
        title,
        label_id: labelId,
        do_text: doText,
        dont_text: dontText,
        short_summary: summary,
        animal_signs: animalSigns,
        status,
        updated_at: serverTimestamp(),
      };

      if (entry) {
        await updateDoc(doc(db, 'date_entries', entry.id), data);
      } else {
        await addDoc(collection(db, 'date_entries'), {
          ...data,
          created_at: serverTimestamp(),
        });
      }
      onBack();
    } catch (error) {
      handleFirestoreError(error, entry ? OperationType.UPDATE : OperationType.CREATE, entry ? `date_entries/${entry.id}` : 'date_entries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {entry ? 'Edit Entry' : 'New Entry'}
        </h1>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Select Date</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "w-full justify-start text-left font-normal py-6 border rounded-md px-4 flex items-center bg-white hover:bg-gray-50 transition-colors",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Assign Activity Label</Label>
              {labels.length === 0 ? (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>No activity labels found. <button type="button" onClick={onManageLabels} className="underline font-bold">Create labels first</button></span>
                </div>
              ) : (
                <Select value={labelId} onValueChange={setLabelId}>
                  <SelectTrigger className="py-6">
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.map(label => (
                      <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Day Title</Label>
              <Input 
                placeholder="e.g. Success Day, Danger Day..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="py-6 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Best Fit For Animal Sign</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ANIMAL_SIGNS.map(sign => (
                  <Button
                    key={sign}
                    type="button"
                    variant={animalSigns.includes(sign) ? "default" : "outline"}
                    onClick={() => toggleAnimalSign(sign)}
                    className={cn(
                      "h-10 text-xs sm:text-sm transition-all",
                      animalSigns.includes(sign) ? "bg-black text-white" : "hover:bg-gray-100"
                    )}
                  >
                    {animalSigns.includes(sign) && <Check className="mr-1 h-3 w-3" />}
                    {sign}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-400 italic">Select one or more animal signs that are a best fit for this day.</p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">What to Do</Label>
              <div className="bg-white rounded-md border border-input">
                <ReactQuill 
                  theme="snow"
                  value={doText}
                  onChange={setDoText}
                  modules={quillModules}
                  formats={quillFormats}
                  className="min-h-[200px]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">What Not to Do</Label>
              <div className="bg-white rounded-md border border-input">
                <ReactQuill 
                  theme="snow"
                  value={dontText}
                  onChange={setDontText}
                  modules={quillModules}
                  formats={quillFormats}
                  className="min-h-[200px]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Short Summary (Optional)</Label>
              <div className="bg-white rounded-md border border-input">
                <ReactQuill 
                  theme="snow"
                  value={summary}
                  onChange={setSummary}
                  modules={quillModules}
                  formats={quillFormats}
                  className="min-h-[150px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-gray-500">Status</Label>
              <Select value={status} onValueChange={(val: EntryStatus) => setStatus(val)}>
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-8 text-xl font-black bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Save className="mr-2 h-6 w-6" />
              )}
              {entry ? 'UPDATE ENTRY' : 'SAVE ENTRY'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
