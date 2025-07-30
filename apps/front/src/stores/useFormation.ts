import { useEffect, useState } from 'react';

interface Formation {
  id: number
  title: string
  description: string
  status: string
  order_number: string
  order_date: string
  total_amount: number
  classroom_student_counts: number
  rate: string
  created_at: string
  updated_at: string
}

export const useFormationStore = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFormations = async () => {
    try {
      const res = await fetch('http://localhost:8000/formations');
      if (!res.ok) throw new Error(res.statusText);
      const data: Formation[] = await res.json(); 
      setFormations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  return { formations, loading };
};