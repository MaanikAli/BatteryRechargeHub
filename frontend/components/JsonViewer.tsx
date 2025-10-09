import React, { useState, useEffect } from 'react';
import { api } from '../src/api';

interface JsonViewerProps {
  endpoint: string;
  title: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ endpoint, title }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (endpoint === 'clients') {
          result = await api.getClients();
        } else if (endpoint === 'vehicleTypes') {
          result = await api.getVehicleTypes();
        } else {
          throw new Error('Unknown endpoint');
        }
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default JsonViewer;
