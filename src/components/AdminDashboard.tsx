import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { DateEntry } from '@/types';
import { format } from 'date-fns';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  Search,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLabel } from '@/types';

interface AdminDashboardProps {
  onEdit: (entry: DateEntry) => void;
  onAdd: () => void;
  onManageLabels: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onEdit, onAdd, onManageLabels }) => {
  const [entries, setEntries] = useState<DateEntry[]>([]);
  const [labels, setLabels] = useState<ActivityLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch labels first for mapping
    const labelsQ = query(collection(db, 'activity_labels'), orderBy('created_at', 'asc'));
    const unsubscribeLabels = onSnapshot(labelsQ, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLabel[];
      setLabels(data);
    });

    const q = query(collection(db, 'date_entries'), orderBy('entry_date', 'desc'));
    
    const unsubscribeEntries = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DateEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'date_entries');
    });

    return () => {
      unsubscribeLabels();
      unsubscribeEntries();
    };
  }, []);

  const getLabelName = (id: string) => {
    return labels.find(l => l.id === id)?.name || 'Unknown';
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteDoc(doc(db, 'date_entries', deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      handleFirestoreError(error, OperationType.DELETE, `date_entries/${deleteId}`);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filteredEntries = entries.filter(entry => {
    const dateStr = format(entry.entry_date.toDate(), 'PPP');
    const plainDo = stripHtml(entry.do_text || '');
    const plainDont = stripHtml(entry.dont_text || '');
    const signsStr = (entry.animal_signs || []).join(' ');
    const labelName = getLabelName(entry.label_id);
    
    return dateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (entry.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           labelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           plainDo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           plainDont.toLowerCase().includes(searchTerm.toLowerCase()) ||
           signsStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Date Entries</h1>
          <p className="text-gray-500">Manage the advice shown on the roulette wheel.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onManageLabels}>
            <Settings className="mr-2 h-4 w-4" /> Manage Labels
          </Button>
          <Button onClick={onAdd} className="bg-black hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add New Entry
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search entries..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[180px] whitespace-nowrap">Date</TableHead>
                  <TableHead className="w-[150px]">Assigned Label</TableHead>
                  <TableHead className="w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[200px]">What to Do</TableHead>
                  <TableHead className="min-w-[200px]">What Not to Do</TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">Status</TableHead>
                  <TableHead className="w-[100px] text-right sticky right-0 bg-gray-50/50 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading entries...
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          {format(entry.entry_date.toDate(), 'PPP')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {getLabelName(entry.label_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-sm truncate max-w-[120px] block">
                          {entry.title || <span className="text-gray-300 italic font-normal">No Title</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {stripHtml(entry.do_text) || <span className="text-gray-300 italic">None</span>}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {stripHtml(entry.dont_text) || <span className="text-gray-300 italic">None</span>}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={entry.status === 'published' ? 'default' : 'secondary'}
                          className={entry.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                        >
                          {entry.status === 'published' ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right sticky right-0 bg-white group-hover:bg-gray-50/50 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEdit(entry)}
                            className="h-8 w-8 text-gray-500 hover:text-black"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(entry.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Delete Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
