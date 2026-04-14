import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { ActivityLabel } from '@/types';
import { Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LabelManager: React.FC = () => {
  const [labels, setLabels] = useState<ActivityLabel[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'activity_labels'), orderBy('created_at', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLabel[];
      setLabels(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activity_labels');
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = newLabel.trim();
    if (!name) return;

    // Check for duplicate
    if (labels.some(l => l.name.toLowerCase() === name.toLowerCase())) {
      setError(`A label with the name "${name}" already exists.`);
      return;
    }

    try {
      await addDoc(collection(db, 'activity_labels'), {
        name,
        created_at: serverTimestamp(),
        order: labels.length
      });
      setNewLabel('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'activity_labels');
    }
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    const name = editValue.trim();
    if (!name) return;

    // Check for duplicate (excluding self)
    if (labels.some(l => l.id !== id && l.name.toLowerCase() === name.toLowerCase())) {
      setError(`A label with the name "${name}" already exists.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'activity_labels', id), {
        name
      });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `activity_labels/${id}`);
    }
  };

  const handleDeleteClick = async (id: string) => {
    setError(null);
    // Check if label is used in any date entries
    try {
      const q = query(collection(db, 'date_entries'), where('label_id', '==', id));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setError('This label is currently assigned to one or more date entries. Please reassign those entries before deleting this label.');
        return;
      }

      setDeleteId(id);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `activity_labels/${id}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'activity_labels', deleteId));
      setDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `activity_labels/${deleteId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Labels</h1>
        <p className="text-gray-500">Manage the segments shown on the roulette wheel.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <X className="h-5 w-5 shrink-0 cursor-pointer" onClick={() => setError(null)} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add New Label</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input 
              placeholder="e.g. Meditation, Travel..." 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" /> Add Label
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading labels...</div>
        ) : labels.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
            No labels found. Add your first activity above.
          </div>
        ) : (
          labels.map((label) => (
            <Card key={label.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />
                  {editingId === label.id ? (
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <Input 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleUpdate(label.id)}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium text-lg">{label.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setEditingId(label.id);
                      setEditValue(label.name);
                    }}
                  >
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteClick(label.id)}
                    className="hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Are you sure you want to delete the label "<strong>{labels.find(l => l.id === deleteId)?.name}</strong>"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? 'Deleting...' : 'Delete Label'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
