import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services';
import { where, orderBy, limit } from 'firebase/firestore';

// Example item interface
interface Item {
  id?: string;
  name: string;
  description: string;
  createdAt: number;
}

const FirestoreExample: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const COLLECTION_NAME = 'items';

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Get all items ordered by creation time
      const data = await firestoreService.query<Item>(
        COLLECTION_NAME,
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) return;
    
    try {
      const newItem: Item = {
        name,
        description,
        createdAt: Date.now()
      };
      
      // Add item to Firestore
      await firestoreService.add<Item>(COLLECTION_NAME, newItem);
      
      // Reset form
      setName('');
      setDescription('');
      
      // Refresh items
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      // Delete item from Firestore
      await firestoreService.delete(COLLECTION_NAME, id);
      
      // Refresh items
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firestore Example</h1>
      
      {/* Add Item Form */}
      <form onSubmit={addItem} className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>
      
      {/* Items List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FirestoreExample; 