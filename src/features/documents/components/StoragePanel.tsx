import { FileText, ImageIcon, Video, Headphones, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetStats } from '../hooks/useDocuments';
import { Skeleton } from '@/components/ui/skeleton';

const storageIcons = {
  Documents: FileText,
  Images: ImageIcon,
  Videos: Video,
  Audio: Headphones,
  Archives: Archive,
};

export function StoragePanel() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const storageData = [
    { type: 'Uploaded', count: stats?.uploaded || 0, icon: FileText },
    { type: 'Processing', count: stats?.processing || 0, icon: Video },
    { type: 'Indexed', count: stats?.indexed || 0, icon: Archive },
    { type: 'Failed', count: stats?.failed || 0, icon: Headphones },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
          </div>

          <div className="space-y-4">
            {storageData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${stats?.total ? (item.count / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
