import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCard, JobData } from '../../components/jobs/JobCard';

interface JobsResponse {
  data: JobData[];
}

interface JobRecommendationsProps {
  employeeId?: string;
}

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({ employeeId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get<JobsResponse>('http://127.0.0.1:8000/recommended_jobs/2');
        setJobs(response.data.data);
      } catch (err) {
        console.error('Error fetching job recommendations:', err);
        setError('Failed to load job recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [employeeId]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Job Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-4">
            <p>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <p>No job recommendations available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, index) => (
              <JobCard key={job.job_id || index} job={job} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
